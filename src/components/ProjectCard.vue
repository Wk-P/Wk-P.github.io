<script setup>
import { t } from '../i18n'
defineProps({ project: { type: Object, required: true } })
</script>

<template>
  <article class="project-card">
    <div class="project-label">{{ t(project.label) }}</div>
    <h3>{{ project.title || t(project.titleKey) }}</h3>
    <p>{{ t(project.body) }}</p>
    <p class="stack">{{ project.stack }}</p>
    <details v-if="project.details?.length || project.status">
      <summary>{{ t('more') }}</summary>
      <ul v-if="project.details"><li v-for="key in project.details" :key="key">{{ t(key) }}</li></ul>
      <p v-if="project.status" class="status-note">{{ t(project.status) }}</p>
    </details>
    <div v-if="project.repo || project.demo || project.paper" class="project-links">
      <a v-if="project.repo" :href="project.repo" target="_blank" rel="noreferrer">{{ t('source') }} ↗</a>
      <a v-if="project.demo" :href="project.demo" target="_blank" rel="noreferrer">{{ t('common.demo') }}</a>
      <a v-if="project.paper" :href="project.paper">{{ t('relatedPaper') }}</a>
    </div>
  </article>
</template>
