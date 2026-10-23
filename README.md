# Lingxiao Zhou — Vue Portfolio

A small Vue 3 + Vite portfolio, deployed as static files to GitHub Pages.
The interface supports English, Chinese, and Korean.

## Local development

Use Node.js 24.12 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:8014/. Vue components and styles update while you edit.
Local development includes clearly marked Markdown drafts.

```sh
npm test
npm run build
npm run preview
```

`npm run preview` serves the production build, which excludes drafts.

## Pages

- `/` — concise introduction and three featured projects.
- `/research/` — three conference paper PDFs.
- `/education/` — high school, bachelor's, and expected master's graduation.
- `/about/` — personal background, contact details, and skills.
- `/projects/` — five projects; details expand on demand.
- `/blog/`, `/archive/`, `/posts/<slug>/` — Markdown notes.
- **`/thesis/` is a separate GitHub Pages project. Do not add files or a Vue route for it.**

The main navigation links directly to the separate `/thesis/` site first, followed by education and personal information. Conference papers remain on `/research/`.
Old `/#academic`, `/#projects`, and `/about/#education` bookmarks still open the relevant content.
The writing block stays hidden on the homepage until there are published notes.

## Editing content

- `src/App.vue` — page layouts and shared navigation.
- `src/components/ProjectCard.vue` — reusable project card.
- `src/style.css` — typography, spacing, and responsive layout.
- `src/data.js` — projects, paper titles, dates, links, and navigation order.
- `src/translations.json`, `src/i18n.js` — translated copy and language state.
- `public/assets/papers/` — research PDFs; their existing URLs are preserved.
- `public/assets/icons/` — existing icons.
- `content/posts/` — trusted Markdown articles with TOML frontmatter.
- `scripts/content.mjs` — validates and loads notes, excluding production drafts.
- `scripts/pages.mjs` — emits real HTML entries, sitemap, RSS, and 404.

To publish a note, add `content/posts/my-note.md`:

```markdown
+++
title = "My note"
date = "2026-10-23"
description = "A short summary."
tags = ["Cloud"]
language = "en"
draft = true
+++

## Context

Write here. Set draft = false when ready to publish.
```

Markdown may contain raw HTML, so only commit trusted article content.
Articles retain the language they were written in.

## Deploy

Push to `main`. `.github/workflows/pages.yml` runs `npm ci`, tests, and
`npm run build`, then deploys only `dist/` to GitHub Pages.
The build creates an HTML entry for every published page, so direct links and
refreshes work without a server rewrite or a hash router. It never creates a
`dist/thesis/` directory.

The Python generator, old HTML template, and manual DOM translation scripts
have been replaced by the Vue application. Do not edit generated `dist/` files.
