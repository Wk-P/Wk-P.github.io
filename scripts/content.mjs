import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'smol-toml'
import { marked } from 'marked'

export function loadPosts(directory = 'content/posts', includeDrafts = false) {
  return readdirSync(directory).filter(name => name.endsWith('.md')).map(name => {
    const source = readFileSync(join(directory, name), 'utf8')
    const parts = source.match(/^\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*\n([\s\S]*)$/)
    if (!parts) throw new Error(`${name}: expected +++ TOML frontmatter +++`)
    const meta = parse(parts[1])
    for (const key of ['title', 'description']) {
      if (typeof meta[key] !== 'string' || !meta[key].trim()) throw new Error(`${name}: missing ${key}`)
    }
    if (!Array.isArray(meta.tags) || meta.tags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`${name}: invalid tags`)
    if (meta.draft !== undefined && typeof meta.draft !== 'boolean') throw new Error(`${name}: draft must be a boolean`)
    const date = String(meta.date)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`${name}: invalid date`)
    const slug = name.slice(0, -3)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${name}: invalid slug`)
    const language = meta.language || 'en'
    if (!['en', 'zh', 'ko'].includes(language)) throw new Error(`${name}: invalid language`)
    const html = marked.parse(parts[2])
    return { ...meta, date, language, slug, route: `/posts/${slug}/`, html, text: html.replace(/<[^>]*>/g, ' ') }
  }).filter(post => includeDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}
