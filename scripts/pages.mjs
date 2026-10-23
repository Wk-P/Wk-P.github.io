// Emit real HTML entry files so direct links work on GitHub Pages, without
// a catch-all router or a generated /thesis/ directory.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { loadPosts } from './content.mjs'

const base = 'https://wk-p.github.io'
const shell = readFileSync('dist/index.html', 'utf8')
const posts = loadPosts()
const routes = [
  ['/', 'Backend / Cloud Engineer'],
  ['/research/', 'Papers & Research'],
  ['/education/', 'Education'],
  ['/about/', 'Personal Info'],
  ['/projects/', 'Projects'],
  ['/blog/', 'Notes'],
  ['/archive/', 'Notes archive'],
  ...posts.map(post => [post.route, post.title]),
]
const escape = text => String(text).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char])
const write = (file, content) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, content) }
for (const [route, title] of routes) {
  const html = shell.replace(/<title>.*?<\/title>/, `<title>${escape(title)} · Lingxiao Zhou</title>`)
    .replace('</head>', `<link rel="canonical" href="${base}${route}" /><meta property="og:title" content="${escape(title)} · Lingxiao Zhou" /><meta property="og:url" content="${base}${route}" /></head>`)
  write(`dist${route}index.html`, html)
}
write('dist/404.html', shell.replace('</head>', '<meta name="robots" content="noindex" /></head>'))
write('dist/.nojekyll', '')
write('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`)
write('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([route]) => `<url><loc>${base}${route}</loc></url>`).join('')}</urlset>`)
write('dist/feed.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Lingxiao Zhou — Notes</title><link>${base}/blog/</link><description>Backend, cloud infrastructure, and research notes.</description>${posts.map(post => `<item><title>${escape(post.title)}</title><link>${base}${post.route}</link><guid>${base}${post.route}</guid><description>${escape(post.description)}</description><pubDate>${new Date(post.date + 'T00:00:00+09:00').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`)
console.log(`Built ${routes.length} page entries and ${posts.length} published notes. /thesis/ remains external.`)
