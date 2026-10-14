"""Build the blog from TOML-frontmatter Markdown. Python 3.11+."""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
from pathlib import Path
import re
import shutil
import tomllib
import xml.etree.ElementTree as ET

import markdown

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist'
BASE = 'https://wk-p.github.io'
esc = html.escape
ICONS = '''<link rel="icon" href="/assets/icons/favicon.ico" sizes="any">
<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icons/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/assets/icons/site.webmanifest">'''


def write(path: str, content: str) -> None:
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding='utf-8')


def page(title: str, description: str, body: str, route: str, active: str = 'Blog', extra: str = '') -> str:
    # The thesis is maintained separately and is not served by this preview.
    body = body.replace('href="/thesis/"', f'href="{BASE}/thesis/"')
    nav = ''.join(f'<a href="{url}"' + (' aria-current="page"' if name == active else '') + f'>{name}</a>'
                  for name, url in [('Blog', '/'), ('Archive', '/archive/'), ('About', '/about/')])
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} · Lingxiao Zhou</title><meta name="description" content="{esc(description, quote=True)}">
<link rel="canonical" href="{BASE}{route}"><meta property="og:title" content="{esc(title, quote=True)}">
<meta property="og:description" content="{esc(description, quote=True)}"><meta property="og:url" content="{BASE}{route}">
<meta property="og:type" content="{'article' if route.startswith('/posts/') else 'website'}">
<meta name="theme-color" content="#faf9f6"><link rel="stylesheet" href="/assets/blog.css">{ICONS}
<link rel="alternate" type="application/rss+xml" title="Lingxiao Zhou — Technical Blog" href="/feed.xml">{extra}
</head><body><a class="skip" href="#content">Skip to content</a><div class="wrap">
<header class="site-header"><a class="wordmark" href="/"><span class="author-name" data-i18n="common.name">Lingxiao Zhou</span><span> / notes</span></a>
<nav class="navigation" aria-label="Main navigation">{nav}<a href="{BASE}/thesis/">Thesis ↗</a><a class="nav-external" href="https://github.com/Wk-P" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav></header>
<main id="content" tabindex="-1">{body}</main>
<footer><span>© {dt.date.today().year} <span data-i18n="common.name">Lingxiao Zhou</span> · Built for writing and learning.</span><div class="footer-links"><a href="/feed.xml">RSS feed ↗</a><a href="mailto:weekend2000119@gmail.com">Email ↗</a></div></footer>
</div><script src="/assets/blog.js" defer></script></body></html>'''


def load_posts(include_drafts: bool) -> list[dict]:
    posts = []
    for path in sorted((ROOT / 'content/posts').glob('*.md')):
        source = path.read_text(encoding='utf-8')
        parts = source.split('+++', 2)
        if len(parts) != 3 or parts[0].strip():
            raise ValueError(f'{path.name}: expected +++ TOML frontmatter +++')
        meta = tomllib.loads(parts[1])
        for key in ['title', 'date', 'description', 'tags']:
            if key not in meta:
                raise ValueError(f'{path.name}: missing {key}')
        for key in ['title', 'description']:
            if not isinstance(meta[key], str) or not meta[key].strip():
                raise ValueError(f'{path.name}: {key} must be nonempty text')
        if not isinstance(meta['tags'], list) or any(not isinstance(t, str) or not t.strip() for t in meta['tags']):
            raise ValueError(f'{path.name}: tags must be a list of nonempty strings')
        if not isinstance(meta.get('draft', False), bool):
            raise ValueError(f'{path.name}: draft must be true or false')
        if meta.get('draft', False) and not include_drafts:
            continue
        date = dt.date.fromisoformat(str(meta['date']))
        slug = path.stem
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
            raise ValueError(f'{path.name}: use a lowercase hyphenated filename')
        md = markdown.Markdown(extensions=['fenced_code', 'tables', 'toc', 'sane_lists'], output_format='html')
        rendered = md.convert(parts[2])
        plain = html.unescape(re.sub(r'<[^>]+>', ' ', rendered))
        posts.append({**meta, 'date': date, 'slug': slug, 'body': rendered, 'toc': md.toc,
                      'text': plain, 'minutes': max(1, round(len(plain.split()) / 200)), 'route': f'/posts/{slug}/'})
    return sorted(posts, key=lambda p: (p['date'], p['slug']), reverse=True)


def tags(post: dict) -> str:
    return '<div class="tags">' + ''.join(f'<span class="tag">{esc(t)}</span>' for t in post['tags']) + '</div>'


def build(include_drafts: bool = False) -> None:
    posts = load_posts(include_drafts)  # Validate content before replacing output.
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(ROOT / 'assets', OUT / 'assets')
    shutil.copyfile(ROOT / 'assets/icons/favicon.ico', OUT / 'favicon.ico')
    write('.nojekyll', '')
    cards = []
    for post in posts:
        badge = '<span class="draft">Draft preview</span>' if post.get('draft') else ''
        search = esc((' '.join([post['title'], post['description'], *post['tags'], post['text']])).lower(), quote=True)
        cards.append(f'''<article class="post-card" data-post data-search="{search}" data-tags="{esc(json.dumps(post['tags']), quote=True)}">
<div class="post-meta"><time datetime="{post['date']}">{post['date'].strftime('%b %d, %Y')}</time><span>{post['minutes']} min read</span>{badge}</div>
<h3><a href="{post['route']}">{esc(post['title'])}</a></h3><p>{esc(post['description'])}</p>
<div class="post-bottom">{tags(post)}<a class="read-link" href="{post['route']}" aria-label="{esc('Read '+post['title'], quote=True)}">Read article ↗</a></div></article>''')
        notice = '<div class="notice">Draft preview — this article is excluded from the published site and RSS feed.</div>' if post.get('draft') else ''
        structured = json.dumps({'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': post['title'],
                                'description': post['description'], 'datePublished': str(post['date']),
                                'author': {'@type': 'Person', 'name': 'Lingxiao Zhou'}, 'url': BASE + post['route']}).replace('<', '\\u003c')
        body = f'''<header class="article-head"><a class="back-link" href="/">← All articles</a><h1>{esc(post['title'])}</h1>
<p class="description">{esc(post['description'])}</p><div class="post-meta"><time datetime="{post['date']}">{post['date'].strftime('%B %d, %Y')}</time><span>{post['minutes']} min read</span>{badge}</div>{tags(post)}</header>
<div class="article-layout"><article class="prose">{notice}{post['body']}<hr><p><a href="/">← Back to the blog</a></p></article>
<aside class="toc" aria-label="Table of contents"><h2>On this page</h2>{post['toc']}</aside></div>'''
        extra = f'<script type="application/ld+json">{structured}</script>'
        if post.get('draft'):
            extra += '<meta name="robots" content="noindex,nofollow">'
        write(f'posts/{post["slug"]}/index.html', page(post['title'], post['description'], body, post['route'], extra=extra))
    all_tags = sorted({t for p in posts for t in p['tags']})
    filters = ''.join(f'<button type="button" data-tag="{esc(t, quote=True)}" aria-pressed="{str(t == "All").lower()}">{esc(t)}</button>' for t in ['All', *all_tags])
    preview_notice = '<div class="notice">Local preview includes unpublished drafts.</div>' if include_drafts else ''
    body = f'''<section class="intro"><div><div class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Engineering & research notes</div><h1>Notes from building.<br>Questions worth exploring.</h1>
<p>Cloud-native systems, backend engineering, and the research behind them. A place to think in public and write things down.</p></div>
<aside class="intro-aside"><b>Hello, I’m Lingxiao.</b><p>Computer Engineering researcher and platform-oriented developer at Pusan National University.</p><a class="text-link" href="/about/">More about me ↗</a></aside></section>
<div class="journal"><section aria-labelledby="latest"><div class="section-top"><h2 id="latest">Latest writing</h2><span class="count" data-count aria-live="polite">{len(posts)} articles</span></div>
{preview_notice}{''.join(cards)}<div class="empty" data-empty {'hidden' if posts else ''}><h3>{'No matching articles' if posts else 'The first post is on its way.'}</h3><p>{'Try another keyword or select All topics.' if posts else 'This is the home for upcoming engineering and research notes. Explore my projects and background on the About page.'}</p><button class="reset-button" type="button" data-reset>Reset filters</button></div></section>
<aside class="sidebar"><h3><label for="search">Find an article</label></h3><form class="search" data-search role="search"><input id="search" name="q" type="search" placeholder="Search title, topic, or keyword…" autocomplete="off"><button type="button" data-clear aria-label="Clear search" hidden>×</button></form><p class="search-hint">Search across titles and article content.</p>
<h3>Browse by tag</h3><div class="filters" role="group" aria-label="Filter articles by tag">{filters}</div>
<div class="sidebar-topics"><h3>Areas of interest</h3><ul class="topic-list"><li>Cloud & infrastructure</li><li>Backend systems</li><li>Optimization & safe RL</li></ul></div>
<div class="sidebar-block"><h3>Beyond the blog</h3><p>Projects, academic work, and an ongoing thesis.</p><a class="text-link" href="/about/#projects">Selected projects ↗</a><br><a class="text-link" href="/thesis/">Thesis workspace ↗</a></div>
<div class="sidebar-block"><h3>Follow along</h3><p>Read new posts in your preferred feed reader.</p><a class="text-link" href="/feed.xml">Subscribe via RSS ↗</a></div></aside></div>'''
    write('index.html', page('Technical Blog', 'Lingxiao Zhou’s notes on cloud-native systems, backend engineering, and research.', body, '/'))
    archive = ''
    year = None
    for post in posts:
        if post['date'].year != year:
            year = post['date'].year
            archive += f'<h2 class="archive-year">{year}</h2>'
        badge = '<span class="draft">Draft</span>' if post.get('draft') else ''
        archive += f'<div class="archive-row"><time datetime="{post["date"]}">{post["date"].strftime("%b %d")}</time><a href="{post["route"]}">{esc(post["title"])}</a>{badge}</div>'
    write('archive/index.html', page('Archive', 'All articles, organized by year.', f'<section class="page-content"><div class="eyebrow">The notebook</div><h1>Writing archive</h1><p>All articles, organized by year.</p>{archive or "<p>No published articles yet.</p>"}</section>', '/archive/', 'Archive'))
    about = (ROOT / 'templates/about.html').read_text(encoding='utf-8')
    write('about/index.html', page('About', 'Lingxiao Zhou’s background, research, and selected engineering projects.', about, '/about/', 'About'))
    write('404.html', page('Page not found', 'This page could not be found.', '<section class="page-content"><div class="eyebrow">404</div><h1>A missing page.</h1><p>The link may have changed. Find the latest writing on the blog.</p><a class="text-link" href="/">Return to the blog →</a></section>', '/404.html', active='', extra='<meta name="robots" content="noindex">'))
    published = [p for p in posts if not p.get('draft')]
    rss = ET.Element('rss', version='2.0')
    channel = ET.SubElement(rss, 'channel')
    for key, value in [('title', 'Lingxiao Zhou — Technical Blog'), ('link', BASE), ('description', 'Notes on systems, backend engineering, and research.'), ('language', 'en')]:
        ET.SubElement(channel, key).text = value
    for post in published:
        item = ET.SubElement(channel, 'item')
        for key, value in [('title', post['title']), ('link', BASE + post['route']), ('guid', BASE + post['route']), ('description', post['description']), ('pubDate', post['date'].strftime('%a, %d %b %Y 00:00:00 +0900'))]:
            ET.SubElement(item, key).text = value
    write('feed.xml', ET.tostring(rss, encoding='unicode', xml_declaration=True))
    sitemap = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    for route in ['/', '/archive/', '/about/', *[p['route'] for p in published]]:
        ET.SubElement(ET.SubElement(sitemap, 'url'), 'loc').text = BASE + route
    write('sitemap.xml', ET.tostring(sitemap, encoding='unicode', xml_declaration=True))
    write('robots.txt', f'User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n')
    print(f'Built {len(posts)} articles into {OUT} ({len(published)} published).')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--drafts', action='store_true', help='Include drafts for local preview only.')
    build(parser.parse_args().drafts)
