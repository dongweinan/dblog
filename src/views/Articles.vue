<template>
  <section class="archive" aria-label="文章归档">
    <p v-if="articles.length === 0" class="archive-empty">还没有文章</p>

    <div v-else class="archive-list">
      <div v-for="group in groups" :key="group.year" class="archive-group">
        <p class="archive-row is-year">
          <em>{{ group.year }}</em>
          <i class="mark" aria-hidden="true" />
          <span class="label">{{ group.items.length }}篇文章</span>
        </p>
        <router-link
          v-for="item in group.items"
          :key="item.id"
          :to="`/articles/${item.id}`"
          class="archive-row is-post"
        >
          <em>{{ monthDay(item.date) }}</em>
          <i class="mark" aria-hidden="true" />
          <span class="label">{{ item.title }}</span>
          <cite v-if="item.tags.length">{{ hashTags(item.tags) }}</cite>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import articlesData from '@/data/articles.json'
import type { Article } from '@/types/article'

const articles = [...(articlesData as Article[])].sort((a, b) =>
  b.date.localeCompare(a.date),
)

const groups = computed(() => {
  const buckets: { year: string; items: Article[] }[] = []
  for (const item of articles) {
    const year = item.date.slice(0, 4)
    const last = buckets[buckets.length - 1]
    if (last?.year === year) last.items.push(item)
    else buckets.push({ year, items: [item] })
  }
  return buckets
})

function monthDay(date: string) {
  return date.slice(5)
}

function hashTags(tags: string[]) {
  return tags.map((tag) => `#${tag}`).join(' ')
}
</script>

<style scoped>
.archive {
  overflow: hidden;
  padding: 2rem 1rem;
  border-radius: 1rem;
  background: var(--bg-card);
  color: var(--vh-font-color);
}

.archive-empty {
  padding: 48px 0;
  color: var(--vh-font-66);
  text-align: center;
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.archive-group {
  display: flex;
  flex-direction: column;
}

.archive-row {
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  border-radius: 1rem;
  color: inherit;
  font-size: 1rem;
  text-decoration: none;
  transition: background 0.18s;
}

.archive-row em {
  flex: none;
  width: 5.05rem;
  height: 3.75rem;
  color: var(--vh-font-color);
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 3.75rem;
  text-align: right;
}

.archive-row.is-post em {
  color: var(--vh-font-28);
  font-size: 0.875rem;
  font-weight: 500;
}

.mark {
  position: relative;
  flex: none;
  width: 2.5rem;
  height: 100%;
}

.mark::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.36rem;
  height: 0.36rem;
  border: 0.28rem solid rgb(0 0 0 / 42%);
  border-radius: 50%;
  background: var(--bg-card);
  transform: translate(-50%, -50%);
  transition: 0.3s;
}

.mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(50% - 0.0625rem);
  width: 0.125rem;
  height: 1rem;
  border-left: 2px dashed rgb(0 0 0 / 10%);
  transform: translateY(-50%);
  pointer-events: none;
}

.archive-row.is-post .mark::before {
  width: 0.25rem;
  height: 0.25rem;
  border: 0;
  border-radius: 0.25rem;
  background: #4e667f;
}

.archive-row.is-post:hover,
.archive-row.is-post:focus-visible {
  background: var(--vh-row-hover);
}

.archive-row.is-post:hover .mark::before,
.archive-row.is-post:focus-visible .mark::before {
  height: 50.66%;
}

.archive-row.is-post:hover .label,
.archive-row.is-post:focus-visible .label {
  padding-left: 0.28rem;
}

.label {
  flex: 1;
  min-width: 0;
  color: var(--vh-font-66);
  font-weight: 500;
  transition: padding 0.18s;
}

.archive-row.is-post .label {
  overflow: hidden;
  color: var(--vh-font-color);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-row cite {
  flex: none;
  width: 7.8rem;
  margin-left: auto;
  overflow: hidden;
  color: var(--vh-font-66);
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-row:focus-visible {
  outline: 2px solid var(--vh-main-color);
  outline-offset: 2px;
}

@media (max-width: 888px) {
  .archive {
    padding: 0;
    background: transparent;
  }

  .archive-row em {
    width: 3rem;
    font-size: 1.2rem;
  }

  .archive-row.is-post em {
    font-size: 0.8rem;
  }

  .mark {
    width: 1.8rem;
  }

  .archive-row cite {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .archive-row,
  .mark::before,
  .label {
    transition: none;
  }
}
</style>
