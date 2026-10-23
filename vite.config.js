import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadPosts } from './scripts/content.mjs'

export default defineConfig(({ command }) => ({
  base: '/',
  plugins: [vue(), {
    name: 'portfolio-posts',
    resolveId(id) { if (id === 'virtual:posts') return '\0virtual:posts' },
    load(id) {
      if (id !== '\0virtual:posts') return
      for (const file of readdirSync('content/posts')) this.addWatchFile(resolve('content/posts', file))
      return `export default ${JSON.stringify(loadPosts('content/posts', command === 'serve'))}`
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/content/posts/')) {
        const module = server.moduleGraph.getModuleById('\0virtual:posts')
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }],
}))
