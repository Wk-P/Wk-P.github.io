# Lingxiao Zhou — Technical Blog

English-first notes on cloud-native systems, backend engineering, and research.

- Website: https://wk-p.github.io/
- Repository: https://github.com/Wk-P/Wk-P.github.io
- Local checkout: `/Users/soar009/Projects/profile`
- `/thesis/` is served by a separate project. Do not add its files here.

## Local preview

Requires Python 3.11 or newer.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python scripts/preview.py
```

Open http://127.0.0.1:8014/. If the port is occupied, add `--port 8015`.
Serve the generated `dist/` directory, not the repository root.
Rebuild after changing content or styles.
The `--drafts` flag includes clearly marked drafts in local preview only.

## Write a post

Create `content/posts/my-post-title.md` with this format:

```markdown
+++
title = "My post title"
date = "2026-10-14"
description = "A short, specific summary of the post."
tags = ["Kubernetes", "Backend"]
draft = true
+++

Opening paragraph.

## The problem

Explain the context, then show a reproducible example.

## What I learned

Document the result and its limitations.
```

The filename becomes `/posts/my-post-title/`. Use lowercase letters,
numbers, and hyphens. Set `draft = false` when ready to publish.
Use `##` and `###` headings to generate the article table of contents.
Markdown supports fenced code blocks, tables, images, and links.
Store images in `assets/` and reference them as `/assets/filename.png`.
Markdown authors may include raw HTML; only commit content you trust.

The included `hello-world.md` is an editable opening draft, not a published article.
A normal build shows an honest empty state until you publish your first post.
Search matches article titles, summaries, tags, and body text. Filters and
search terms are reflected in the URL for sharing.

## Structure

- `content/posts/` — Markdown articles with TOML metadata.
- `assets/blog.css` — blog layout and typography.
- `assets/blog.js` — search and tag filters.
- `templates/about.html` — existing multilingual portfolio at `/about/`.
- `scripts/build.py` — generator for pages, RSS, sitemap, and 404.
- `dist/` — generated website; ignored by Git.

## Check and publish

```sh
.venv/bin/python -m unittest discover -s tests
node --check assets/blog.js
node tests/search.cjs
.venv/bin/python scripts/build.py
```

Commit and push to `main` to trigger `.github/workflows/pages.yml`.
GitHub Actions builds **without drafts** and uploads only `dist/` to Pages.
The homepage is generated from `scripts/build.py`; do not edit generated files.
RSS (`/feed.xml`) and the sitemap include published articles only.
No server, database, or account is required for readers.
