import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadPosts } from '../scripts/content.mjs'
import { resolvePage, thesisUrl, navigation, papers } from '../src/data.js'

const markdown = (draft = false) => `+++\ntitle = "A system & its limits"\ndate = "2026-10-14"\ndescription = "Notes on systems"\ntags = ["Cloud"]\ndraft = ${draft}\n+++\n## Design\n\n\`\`\`python\nprint(1)\n\`\`\`\n`
test('drafts stay out of production and Markdown renders', () => {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-posts-'))
  try {
    writeFileSync(join(dir, 'public.md'), markdown())
    writeFileSync(join(dir, 'draft.md'), markdown(true))
    const production = loadPosts(dir)
    assert.equal(production.length, 1)
    assert.match(production[0].html, /<h2>Design<\/h2>/)
    assert.match(production[0].html, /language-python/)
    assert.equal(production[0].route, '/posts/public/')
    assert.equal(loadPosts(dir, true).length, 2)
    writeFileSync(join(dir, 'invalid.md'), markdown().replace('2026-10-14', '2026-02-30'))
    assert.throws(() => loadPosts(dir), /invalid date/)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
test('legacy links resolve and thesis path stays separate', () => {
  assert.equal(thesisUrl, 'https://wk-p.github.io/thesis/')
  assert.equal(resolvePage('/thesis/'), 'missing')
  assert.equal(resolvePage('/', '#academic'), 'research')
  assert.equal(resolvePage('/about/', '#education'), 'education')
  assert.equal(resolvePage('/', '#projects'), 'projects')
  assert.equal(resolvePage('/archive/'), 'blog')
  assert.equal(resolvePage('/unknown/'), 'missing')
  assert.deepEqual(navigation.slice(0, 3).map(item => item.path), [thesisUrl, '/education/', '/about/'])
  assert.equal(papers.length, 3)
})
