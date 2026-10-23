<script setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useLanguage } from './i18n'
import { education, email, githubUrl, navigation, papers, projects, resolvePage, skills, thesisUrl } from './data'
import posts from 'virtual:posts'
import ProjectCard from './components/ProjectCard.vue'

const { language, t } = useLanguage()
const locationKey = ref(location.pathname + location.hash)
const currentPage = computed(() => { locationKey.value; return resolvePage(location.pathname, location.hash) })
const params = new URLSearchParams(location.search)
const search = ref(params.get('q') || '')
const tag = ref(params.get('tag') || '')
const tags = [...new Set(posts.flatMap(post => post.tags))]
if (!tags.includes(tag.value)) tag.value = ''
watch([search, tag], () => {
  if (currentPage.value !== 'blog') return
  const url = new URL(location.href)
  search.value ? url.searchParams.set('q', search.value) : url.searchParams.delete('q')
  tag.value ? url.searchParams.set('tag', tag.value) : url.searchParams.delete('tag')
  history.replaceState(null, '', url)
})
const filteredPosts = computed(() => posts.filter(post => (!tag.value || post.tags.includes(tag.value)) &&
  `${post.title} ${post.description} ${post.tags.join(' ')} ${post.text}`.toLowerCase().includes(search.value.trim().toLowerCase())))
const post = computed(() => posts.find(item => item.route === location.pathname.replace(/\/?$/, '/')))
const titles = { home: 'role', research: 'nav.research', education: 'nav.education', about: 'nav.personal', projects: 'nav.projects', blog: 'blog', missing: 'missing' }
watchEffect(() => {
  document.title = `${currentPage.value === 'post' ? post.value?.title || t('missing') : t(titles[currentPage.value])} · ${t('common.name')}`
})
function syncLocation() {
  locationKey.value = location.pathname + location.hash
  const params = new URLSearchParams(location.search)
  search.value = params.get('q') || ''
  tag.value = tags.includes(params.get('tag')) ? params.get('tag') : ''
}
onMounted(() => {
  window.addEventListener('hashchange', syncLocation)
  window.addEventListener('popstate', syncLocation)
  // Vue renders anchor targets after the static HTML has loaded.
  requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView())
})
onUnmounted(() => {
  window.removeEventListener('hashchange', syncLocation)
  window.removeEventListener('popstate', syncLocation)
})
</script>

<template>
  <a class="skip-link" href="#content">{{ t('common.skip') }}</a>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="/" :aria-label="`${t('common.name')} · ${t('home')}`"><span class="monogram" aria-hidden="true">LZ</span><span>Lingxiao Zhou</span></a>
      <nav aria-label="Main navigation">
        <a v-for="item in navigation" :key="item.path" :href="item.path" :aria-current="currentPage === item.path.split('/')[1] ? 'page' : undefined">{{ t(item.key) }}</a>
      </nav>
      <div class="language-switch" role="group" aria-label="Language">
        <button v-for="item in [{ id: 'zh', text: '中', lang: 'zh-CN' }, { id: 'en', text: 'EN', lang: 'en' }, { id: 'ko', text: '한', lang: 'ko' }]" :key="item.id" :lang="item.lang" :aria-label="{ zh: '中文', en: 'English', ko: '한국어' }[item.id]" :aria-pressed="language === item.id" @click="language = item.id">{{ item.text }}</button>
      </div>
    </header>

    <main id="content" tabindex="-1">
      <template v-if="currentPage === 'home'">
        <section class="hero">
          <p class="eyebrow">Backend / Cloud / AI Systems</p>
          <h1>{{ t('common.name') }}<span class="hero-role">{{ t('role') }}</span></h1>
          <p class="hero-summary">{{ t('hero.summary') }}</p>
          <p class="hero-affiliation">{{ t('hero.degree') }}</p>
          <div class="actions"><a class="button primary" href="/projects/">{{ t('hero.projects') }}</a><a class="button" :href="githubUrl" target="_blank" rel="noreferrer">GitHub ↗</a><a class="quiet-link" :href="`mailto:${email}`">{{ t('email') }} ↗</a></div>
        </section>
        <section class="work-section" aria-labelledby="selected-work">
          <div class="section-heading"><h2 id="selected-work">{{ t('overview') }}</h2><a href="/projects/">{{ t('allProjects') }}</a></div>
          <div class="project-grid"><ProjectCard v-for="project in projects.slice(0, 3)" :key="project.id" :project="project" /></div>
        </section>
        <a class="research-strip" href="/research/"><div><span class="eyebrow">{{ t('researchLabel') }}</span><h2>Safe RL · Edge Computing · Cloud Security</h2><p>{{ t('thesisSummary') }}</p></div><span aria-hidden="true">↗</span></a>
        <section v-if="posts.some(item => !item.draft)" class="notes-preview"><div class="section-heading"><h2>{{ t('blog') }}</h2><a href="/blog/">{{ t('notesLink') }}</a></div><a v-for="item in posts.filter(item => !item.draft).slice(0, 2)" :key="item.slug" class="note-row" :href="item.route">{{ item.title }} <span>↗</span></a></section>
      </template>

      <template v-else-if="currentPage === 'research'">
        <header class="page-heading"><p class="eyebrow">{{ t('researchLabel') }}</p><h1>{{ t('nav.research') }}</h1><p>{{ t('academic.lead') }}</p></header>
        <section class="thesis-feature" id="thesis"><span class="eyebrow">{{ t('thesisLabel') }} · {{ t('thesis.status') }}</span><h2>{{ t('thesis.title') }}</h2><p>{{ t('thesis.lead') }}</p><a class="button primary" :href="thesisUrl">{{ t('thesis.open') }}</a></section>
        <section class="paper-list" id="academic" :aria-label="t('academic.title')">
          <article v-for="(paper, index) in papers" :id="`paper-${paper.id}`" :key="paper.id" class="paper-row"><span class="row-number">0{{ index + 1 }}</span><div><p class="eyebrow">{{ paper.venue }}</p><h2>{{ paper.title }}</h2><p class="authors">{{ paper.authors }}</p><a :href="paper.pdf" target="_blank" rel="noreferrer">{{ t('paper.pdf') }}</a></div></article>
        </section>
        <p class="poster-note"><strong>ICMU 2025 · Poster</strong><br>{{ t('academic.icmu.body') }}</p>
      </template>

      <template v-else-if="currentPage === 'education'">
        <header class="page-heading"><p class="eyebrow">{{ t('educationLabel') }}</p><h1>{{ t('education.title') }}</h1><p>{{ t('education.lead') }}</p></header>
        <section id="education" class="education-list" :aria-label="t('educationLabel')"><article v-for="item in education" :key="item.id" class="education-row"><div class="education-date">{{ item.start }} – {{ item.end }}</div><div><div class="education-top"><span class="eyebrow">{{ t(`education.${item.id}.short`) }}</span><span class="badge">{{ t(`education.${item.id}.meta`) }}</span></div><h2>{{ t(`education.${item.id}.title`) }}</h2><p v-if="item.school" class="school">{{ t(item.school) }}</p><p>{{ t(`education.${item.id}.body`) }}</p></div></article></section>
      </template>

      <template v-else-if="currentPage === 'about'">
        <header class="page-heading"><p class="eyebrow">{{ t('aboutLabel') }}</p><h1>{{ t('common.name') }}</h1><p>{{ t('hero.summary') }}</p></header>
        <dl class="profile-facts"><div><dt>{{ t('fact.university.label') }}</dt><dd>{{ t('fact.university.value') }}</dd></div><div><dt>{{ t('fact.status.label') }}</dt><dd>{{ t('fact.status.value') }}</dd></div><div><dt>{{ t('fact.focus.label') }}</dt><dd>{{ t('fact.focus.value') }}</dd></div></dl>
        <div class="actions"><a class="button primary" :href="`mailto:${email}`">{{ t('email') }} ↗</a><a class="button" :href="githubUrl" target="_blank" rel="noreferrer">GitHub ↗</a><a class="quiet-link" href="/education/">{{ t('nav.education') }} →</a></div>
        <section class="skills-section" id="skills"><h2>{{ t('skills.title') }}</h2><dl class="skill-list"><div v-for="skill in skills" :key="skill.key"><dt>{{ t(skill.key) }}</dt><dd>{{ skill.value }}</dd></div></dl></section>
      </template>

      <template v-else-if="currentPage === 'projects'">
        <header class="page-heading"><p class="eyebrow">{{ t('nav.projects') }}</p><h1>{{ t('projects.title') }}</h1><p>{{ t('projects.lead') }}</p></header>
        <section id="projects" class="project-grid full-grid"><ProjectCard v-for="project in projects" :key="project.id" :project="project" /></section>
        <details class="other-projects"><summary>{{ t('other') }}</summary><h2>Gproject</h2><p>{{ t('projects.gproject.body') }}</p><a href="https://github.com/Wk-P/Gproject" target="_blank" rel="noreferrer">{{ t('source') }} ↗</a></details>
      </template>

      <template v-else-if="currentPage === 'blog'">
        <header class="page-heading"><p class="eyebrow">{{ t('blog') }}</p><h1>{{ t('blog') }}</h1></header>
        <template v-if="posts.length"><div class="note-filters"><label>{{ t('search') }}<input v-model="search" type="search" /></label><select v-model="tag" :aria-label="t('allTags')"><option value="">{{ t('allTags') }}</option><option v-for="item in tags" :key="item">{{ item }}</option></select></div><article v-for="item in filteredPosts" :key="item.slug" class="note-item"><p class="eyebrow">{{ item.date }} <span v-if="item.draft"> · {{ t('draft') }}</span></p><h2><a :href="item.route">{{ item.title }}</a></h2><p>{{ item.description }}</p></article><p v-if="!filteredPosts.length">{{ t('noResults') }}</p></template>
        <p v-else class="muted">{{ t('empty') }}</p>
      </template>

      <template v-else-if="currentPage === 'post' && post">
        <header class="page-heading"><a class="quiet-link" href="/blog/">← {{ t('blog') }}</a><p class="eyebrow">{{ post.date }} · {{ t('original') }}: {{ post.language }}</p><h1>{{ post.title }}</h1><p>{{ post.description }}</p><p v-if="post.draft" class="badge">{{ t('notPublished') }}</p></header>
        <!-- Markdown is authored and trusted in this repository, never user-submitted. -->
        <article class="prose" :lang="post.language" v-html="post.html"></article>
      </template>
      <section v-else class="page-heading"><p class="eyebrow">404</p><h1>{{ t('missing') }}</h1><a href="/">{{ t('back') }}</a></section>
    </main>

    <footer><span>© {{ new Date().getFullYear() }} Lingxiao Zhou</span><div><a v-if="posts.length || currentPage === 'blog'" href="/blog/">{{ t('blog') }}</a><a :href="thesisUrl">{{ t('thesisLabel') }} ↗</a><a :href="`mailto:${email}`">{{ t('email') }} ↗</a><a :href="githubUrl" target="_blank" rel="noreferrer">GitHub ↗</a></div></footer>
  </div>
</template>
