<template>
  <section class="flex min-w-0 w-full flex-1 flex-col xl:h-full xl:min-h-0" aria-label="文章">
    <p v-if="articles.length === 0" class="article-empty py-48px text-center">
      还没有文章
    </p>
    <template v-else>
      <ul class="grid list-none grid-cols-1 gap-12px md:grid-cols-2 xl:min-h-0 xl:flex-1 xl:grid-cols-3 xl:grid-rows-4">
        <li v-for="item in pageArticles" :key="item.id" class="min-h-0">
          <article class="article-card flex h-full min-h-0 flex-col overflow-hidden rounded-16px px-16px pb-12px pt-14px">
            <div class="article-meta mb-8px flex items-center justify-between gap-12px text-12px tabular-nums">
              <span class="article-category">{{ item.category }}</span>
              <time :datetime="item.date">{{ formatDate(item.date) }}</time>
            </div>
            <h3 class="article-title mb-6px text-16px font-600 line-clamp-2">
              {{ item.title }}
            </h3>
            <p class="article-summary min-h-0 flex-1 text-13px line-clamp-3">
              {{ item.summary }}
            </p>
            <ul class="mt-auto flex list-none flex-wrap gap-6px pt-8px" :aria-label="`${item.title}的标签`">
              <li
                v-for="tag in item.tags"
                :key="tag"
                class="article-tag rounded-full px-8px py-2px text-12px"
              >
                {{ tag }}
              </li>
            </ul>
          </article>
        </li>
      </ul>
      <nav v-if="pageCount > 1" class="mt-12px flex shrink-0 items-center justify-center gap-8px" aria-label="文章分页">
        <button type="button" class="pager-btn" :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
          上一页
        </button>
        <button
          v-for="page in pageCount"
          :key="page"
          type="button"
          class="pager-btn pager-num"
          :class="{ 'is-active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
        <button type="button" class="pager-btn" :disabled="currentPage === pageCount" @click="goTo(currentPage + 1)">
          下一页
        </button>
      </nav>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import articlesData from '@/data/articles.json'

interface Article {
  id: string
  title: string
  summary: string
  date: string
  category: string
  tags: string[]
}

const articles = [...(articlesData as Article[])].sort((a, b) =>
  b.date.localeCompare(a.date),
)

const pageSize = 12
const currentPage = ref(1)
const pageCount = computed(() => Math.ceil(articles.length / pageSize))
const pageArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return articles.slice(start, start + pageSize)
})

function goTo(page: number) {
  const next = Math.min(Math.max(page, 1), pageCount.value)
  if (next === currentPage.value) return
  currentPage.value = next
}

function formatDate(date: string) {
  return date.replaceAll('-', '.')
}
</script>

<style scoped>
.article-empty,
.article-meta,
.article-summary,
.article-tag {
  color: var(--text-secondary);
}

.article-meta {
  letter-spacing: 0.04em;
}

.article-category {
  color: #3d7eff;
  letter-spacing: 0.12em;
}

.article-title {
  color: var(--text-primary);
  line-height: 1.45;
  letter-spacing: 0.02em;
}

.article-summary {
  line-height: 1.7;
}

.article-card {
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(7, 17, 27, 0.08);
}

.article-tag {
  background: color-mix(in srgb, var(--bg-primary) 55%, #e8eef8);
  line-height: 1.6;
}

.pager-btn {
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: var(--bg-card);
  box-shadow: inset 0 0 0 1px var(--border-color);
  color: var(--text-primary);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.pager-num {
  min-width: 36px;
  padding: 0 8px;
}

.pager-btn:hover:not(:disabled, .is-active) {
  color: #3d7eff;
}

.pager-btn.is-active {
  background: #3d7eff;
  box-shadow: none;
  color: #fff;
}

.pager-btn:disabled {
  color: var(--text-secondary);
  opacity: 0.45;
  cursor: default;
}

.pager-btn:focus-visible {
  outline: 2px solid #3d7eff;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .article-card {
    transition: none;
  }

  .article-card:hover {
    transform: none;
  }
}
</style>
