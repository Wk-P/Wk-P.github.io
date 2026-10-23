import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('blog_build', ROOT / 'scripts/build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class BuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.original_root, self.original_out = build.ROOT, build.OUT
        build.ROOT, build.OUT = self.root, self.root / 'dist'
        (self.root / 'content/posts').mkdir(parents=True)
        shutil.copytree(ROOT / 'assets', self.root / 'assets')
        shutil.copytree(ROOT / 'templates', self.root / 'templates')

    def tearDown(self):
        build.ROOT, build.OUT = self.original_root, self.original_out
        self.temp.cleanup()

    def post(self, slug, draft=False, date='2026-10-14'):
        (self.root / f'content/posts/{slug}.md').write_text(f'''+++
title = "A <system> & its limits"
date = "{date}"
description = "A reproducible example."
tags = ["Backend"]
draft = {str(draft).lower()}
+++
## Design

```python
print("hello")
```

| Input | Output |
| --- | --- |
| a | b |
''')

    def test_published_build_renders_markdown_and_excludes_drafts(self):
        self.post('published'); self.post('private-draft', draft=True)
        build.build()
        out = build.OUT
        self.assertFalse((out / 'posts/private-draft').exists())
        article = (out / 'posts/published/index.html').read_text()
        self.assertIn('<h2 id="design">Design</h2>', article)
        self.assertIn('href="#design"', article)
        self.assertIn('<code class="language-python">', article)
        self.assertIn('<table>', article)
        self.assertIn('A &lt;system&gt; &amp; its limits', article)
        items = ET.parse(out / 'feed.xml').findall('./channel/item')
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].findtext('link'), 'https://wk-p.github.io/posts/published/')
        self.assertNotIn('private-draft', (out / 'sitemap.xml').read_text())
        self.assertFalse((out / 'thesis').exists())
        self.assertTrue((out / 'about/index.html').exists())
        about = (out / 'about/index.html').read_text()
        self.assertIn('href="/assets/blog.css"', about)
        self.assertEqual(about.count('class="site-header"'), 1)
        self.assertIn('href="/about/" aria-current="page"', about)
        self.assertNotIn('global-canvas', about)
        for route in ['index.html', 'archive/index.html', 'about/index.html', 'posts/published/index.html', '404.html']:
            text = (out / route).read_text()
            self.assertEqual(text.count('class="lang-switch"'), 1, route)
            self.assertIn('data-lang="zh"', text)
            self.assertIn('data-lang="ko"', text)
        self.assertIn('data-content-language="en"', article)

    def test_preview_marks_drafts_but_keeps_feed_clean(self):
        self.post('preview', draft=True)
        build.build(include_drafts=True)
        article = (build.OUT / 'posts/preview/index.html').read_text()
        self.assertIn('Draft preview', article)
        self.assertIn('noindex,nofollow', article)
        self.assertEqual(ET.parse(build.OUT / 'feed.xml').findall('./channel/item'), [])
        build.build()
        self.assertFalse((build.OUT / 'posts/preview').exists())
        self.assertNotIn('The first post is on its way.', (build.OUT / 'index.html').read_text())
        self.assertIn('The first post is on its way.', (build.OUT / 'blog/index.html').read_text())

    def test_portfolio_prioritizes_experience_and_links_real_papers(self):
        build.build()
        home = (build.OUT / 'index.html').read_text()
        about = (build.OUT / 'about/index.html').read_text()
        self.assertIn('href="/" aria-current="page"', home)
        self.assertIn('Backend / Cloud Engineer', home)
        self.assertNotIn('data-count', home)
        self.assertNotIn('Gproject', home)
        self.assertIn('Gproject', about)
        self.assertNotIn('KCI', home + about)
        self.assertLess(home.index('CloudPlatform'), home.index('Femoup MVP'))
        self.assertLess(home.index('Femoup MVP'), home.index('Kubernetes / Private Cloud Security'))
        self.assertIn('https://wk-p.github.io/thesis/', home)
        import re
        papers = re.findall(r'href="(/assets/papers/[^" ]+\.pdf)"', home)
        self.assertEqual(len(papers), 3)
        for paper in papers:
            self.assertTrue((build.OUT / paper.lstrip('/')).read_bytes().startswith(b'%PDF'))
        self.assertIn('/blog/', (build.OUT / 'sitemap.xml').read_text())
        self.post('published')
        build.build()
        self.assertIn('home-writing', (build.OUT / 'index.html').read_text())

    def test_invalid_content_preserves_previous_output(self):
        self.post('valid'); build.build()
        before = (build.OUT / 'index.html').read_text()
        self.post('invalid', date='not-a-date')
        with self.assertRaises(ValueError):
            build.build()
        self.assertEqual((build.OUT / 'index.html').read_text(), before)


if __name__ == '__main__':
    unittest.main()
