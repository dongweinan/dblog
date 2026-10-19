<template>
  <section ref="boardRef" class="article-board" aria-label="文章">
    <div v-if="showFilter" class="article-toolbar">
      <div class="article-filters" role="tablist" aria-label="按分类筛选">
        <button
          v-for="chip in categoryChips"
          :key="chip"
          type="button"
          role="tab"
          class="filter-chip"
          :class="{ 'is-active': activeCategory === chip }"
          :aria-selected="activeCategory === chip"
          @click="setCategory(chip)"
        >
          {{ chip }}
        </button>
      </div>
    </div>

    <p v-if="filteredArticles.length === 0" class="article-empty">还没有文章</p>
    <template v-else>
      <ul class="article-grid">
        <li v-for="item in pageArticles" :key="item.id">
          <router-link
            :to="`/articles/${item.id}`"
            class="article-card"
            :style="{ '--cat': categoryColor(item.category) }"
          >
            <header>
              <div class="meta-row">
                <span class="article-cat">{{ item.category }}</span>
                <time :datetime="item.date">{{
                  formatArticleDate(item.date)
                }}</time>
              </div>
              <h3 class="article-title">{{ item.title }}</h3>
            </header>
            <p class="article-excerpt">{{ item.summary }}</p>
            <p
              v-if="item.tags.length"
              class="article-tags"
              :aria-label="`${item.title}的标签`"
            >
              <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </p>
          </router-link>
        </li>
      </ul>

      <nav v-if="!limit && pageCount > 1" class="pager" aria-label="文章分页">
        <button
          type="button"
          class="pager-btn"
          :disabled="currentPage === 1"
          aria-label="上一页"
          @click="goTo(currentPage - 1)"
        >
          ‹
        </button>
        <button
          v-for="page in pageCount"
          :key="page"
          type="button"
          class="pager-btn"
          :class="{ 'is-active': page === currentPage }"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`第 ${page} 页`"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          class="pager-btn"
          :disabled="currentPage === pageCount"
          aria-label="下一页"
          @click="goTo(currentPage + 1)"
        >
          ›
        </button>
      </nav>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import articlesData from '@/data/articles.json'
import { categoryColor, formatArticleDate, type Article } from '@/types/article'

const props = withDefaults(
  defineProps<{
    limit?: number
    showFilter?: boolean
  }>(),
  {
    showFilter: true,
  },
)

const ALL = '全部'
const ROWS = 4
const THREE_COLUMNS_AT = 860

const articles = [...(articlesData as Article[])].sort((a, b) =>
  b.date.localeCompare(a.date),
)

const categories = [...new Set(articles.map((item) => item.category))]
const categoryChips = [ALL, ...categories]
const activeCategory = ref(ALL)
const boardRef = ref<HTMLElement | null>(null)
const columns = ref(estimateColumns())
const pageSize = computed(() => columns.value * ROWS)
const currentPage = ref(1)
let resizeObserver: ResizeObserver | null = null

function estimateColumns() {
  if (typeof window === 'undefined') return 1
  const viewport = window.innerWidth
  const pane = Math.min(1440, viewport) - 32 - (viewport >= 1280 ? 336 : 0)
  return pane - 12 >= THREE_COLUMNS_AT ? 3 : 1
}

function syncColumns(width: number) {
  const next = width >= THREE_COLUMNS_AT ? 3 : 1
  if (next !== columns.value) columns.value = next
}

const filteredArticles = computed(() => {
  if (activeCategory.value === ALL) return articles
  return articles.filter((item) => item.category === activeCategory.value)
})

const pageCount = computed(() =>
  Math.ceil(filteredArticles.value.length / pageSize.value),
)

const pageArticles = computed(() => {
  if (props.limit) return filteredArticles.value.slice(0, props.limit)
  const start = (currentPage.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, start + pageSize.value)
})

watch(activeCategory, () => {
  currentPage.value = 1
})

watch(pageSize, () => {
  if (currentPage.value > pageCount.value)
    currentPage.value = Math.max(pageCount.value, 1)
})

onMounted(() => {
  const board = boardRef.value
  if (!board) return
  const style = getComputedStyle(board)
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
  syncColumns(board.clientWidth - padding)
  resizeObserver = new ResizeObserver((entries) => {
    syncColumns(entries[0]?.contentRect.width ?? 0)
  })
  resizeObserver.observe(board)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

function setCategory(chip: string) {
  activeCategory.value = chip
}

function goTo(page: number) {
  const next = Math.min(Math.max(page, 1), pageCount.value)
  if (next === currentPage.value) return
  currentPage.value = next
  const board = boardRef.value
  if (!board) {
    window.scrollTo({ top: 0 })
    return
  }
  const top = board.getBoundingClientRect().top + window.scrollY - 78
  window.scrollTo({ top: Math.max(0, top) })
}
</script>

<style scoped>
.article-board {
  container-type: inline-size;
  padding: 0 6px 16px;
  color: var(--vh-font-color);
}

.article-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  margin-bottom: 14px;
}

.article-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.article-empty {
  padding: 48px 0;
  color: var(--vh-font-66);
  text-align: center;
}

.article-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.article-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.15rem 1.25rem 1rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--vh-card-line) 88%, transparent);
  border-radius: 16px;
  background:
    radial-gradient(
      140px 72px at 0 0,
      color-mix(in srgb, var(--cat) 14%, transparent),
      transparent 72%
    ),
    var(--bg-card);
  box-shadow: var(--vh-box-shadow);
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.article-card:hover,
.article-card:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(7, 17, 27, 0.09);
}

:global(html.dark) .article-card:hover,
:global(html.dark) .article-card:focus-visible {
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.38);
}

.article-card header {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.article-cat {
  color: var(--cat);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
}

.meta-row time {
  flex: none;
  color: var(--vh-font-66);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  line-height: 1;
}

.article-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--vh-font-color);
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.18s ease;
}

.article-excerpt {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 0.7rem;
  color: var(--vh-font-66);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.7rem;
  margin-top: auto;
  padding-top: 0.95rem;
}

.article-tags span {
  color: var(--vh-font-66);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

.article-tags span::before {
  content: '#';
  color: var(--vh-font-28);
}

.article-card:hover .article-title,
.article-card:focus-visible .article-title {
  color: var(--vh-main-color);
}

.article-card:focus-visible {
  outline: 2px solid var(--vh-main-color);
  outline-offset: 3px;
}

.pager {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
}

.pager-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--vh-card-line) 88%, transparent);
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
  color: var(--vh-font-66);
  font: inherit;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.pager-btn:hover:not(:disabled, .is-active) {
  border-color: transparent;
  background: var(--vh-row-hover);
  color: var(--vh-font-color);
}

.pager-btn.is-active {
  border-color: transparent;
  background: #3d7eff;
  color: #fff;
  cursor: default;
}

.pager-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.pager-btn:focus-visible,
.filter-chip:focus-visible {
  outline: 2px solid var(--vh-main-color);
  outline-offset: 3px;
}

.filter-chip {
  height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--border-color);
  color: var(--vh-font-66);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.filter-chip.is-active {
  background: var(--vh-main-color);
  box-shadow: none;
  color: #fff;
}

@container (min-width: 860px) {
  .article-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-card,
  .article-title,
  .pager-btn {
    transition: none;
  }

  .article-card:hover,
  .article-card:focus-visible {
    transform: none;
  }
}
</style>
