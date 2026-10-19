<template>
  <div class="detail-page">
    <p v-if="!article" class="detail-empty">
      找不到这篇文章
      <router-link to="/articles">返回文章</router-link>
    </p>

    <template v-else>
      <article class="post">
        <header>
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
              <time :datetime="article.date">{{ article.date }}</time>
              <span class="count"
                ><strong>{{ charCount }}</strong
                >字</span
              >
              <span class="read"
                ><strong>{{ minutes }}</strong
                >分钟</span
              >
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 7h14M8 12h11M11 17h8" />
              </svg>
              <span>{{ article.category }}</span>
            </span>
          </div>
        </header>
        <div class="post-body">
          <p>{{ article.summary }}</p>
          <p
            v-if="article.tags.length"
            class="tag-list"
            :aria-label="`${article.title}的标签`"
          >
            <span v-for="tag in article.tags" :key="tag">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8 8h.01M4 7.5V12l8.5 8.5a2 2 0 0 0 2.8 0L21 15a2 2 0 0 0 0-2.8L12.5 3.5H8a4 4 0 0 0-4 4Z"
                />
              </svg>
              {{ tag }}
            </span>
          </p>
        </div>
      </article>

      <nav
        v-if="newer || older"
        class="ot-article"
        :class="{ 'only-next': !newer && older }"
        aria-label="相邻文章"
      >
        <router-link
          v-if="newer"
          :to="`/articles/${newer.id}`"
          class="art-item"
          :aria-label="`上一篇：${newer.title}`"
        >
          <span>{{ newer.title }}</span>
        </router-link>
        <router-link
          v-if="older"
          :to="`/articles/${older.id}`"
          class="art-item is-older"
          :aria-label="`下一篇：${older.title}`"
        >
          <span>{{ older.title }}</span>
        </router-link>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import articlesData from '@/data/articles.json'
import type { Article } from '@/types/article'

const route = useRoute()
const articles = [...(articlesData as Article[])].sort((a, b) =>
  b.date.localeCompare(a.date),
)

const index = computed(() =>
  articles.findIndex((item) => item.id === route.params.id),
)
const article = computed(() =>
  index.value >= 0 ? articles[index.value] : null,
)
const newer = computed(() =>
  index.value > 0 ? articles[index.value - 1] : null,
)
const older = computed(() =>
  index.value >= 0 && index.value < articles.length - 1
    ? articles[index.value + 1]
    : null,
)

const charCount = computed(() => article.value?.summary.length ?? 0)
const minutes = computed(() => Math.max(1, Math.ceil(charCount.value / 400)))
</script>

<style scoped>
.detail-page {
  padding-bottom: 24px;
  color: var(--vh-font-color);
}

.detail-empty {
  padding: 64px 0;
  color: var(--vh-font-66);
  text-align: center;
}

.detail-empty a {
  display: block;
  margin-top: 12px;
  color: var(--vh-main-color);
}

.post > header {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 2rem 1rem 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
}

.post > header h1 {
  font-size: 1.58rem;
  font-weight: 700;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.88rem;
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.18rem;
}

.meta-item svg {
  flex: none;
  width: 0.888rem;
  height: 0.888rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.meta-item time {
  color: var(--vh-font-66);
}

.count {
  padding-left: 0.38rem;
  color: #3fa67f;
}

.count strong {
  color: #3fa67f;
}

.read,
.read strong {
  color: #e9b740;
}

.post-body {
  padding: 1rem;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  background: var(--bg-card);
  box-shadow: 0 12px 8px 6px rgb(7 17 27 / 5%);
}

.post-body > p:first-child {
  font-size: 1rem;
  line-height: 1.9;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.58rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.tag-list span {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  height: 1.5rem;
  padding: 0 0.3125rem;
  border-radius: 0.28rem;
  font-size: 0.76rem;
}

.tag-list svg {
  width: 0.8rem;
  height: 0.8rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: rotate(90deg);
}

.tag-list span:nth-of-type(6n + 1) {
  color: #bec4cc;
  background: #bec4cc18;
}

.tag-list span:nth-of-type(6n + 2) {
  color: #3253b4;
  background: #3253b418;
}

.tag-list span:nth-of-type(6n + 3) {
  color: #01c4b6;
  background: #01c4b618;
}

.tag-list span:nth-of-type(6n + 4) {
  color: #dd8636;
  background: #dd863618;
}

.tag-list span:nth-of-type(6n + 5) {
  color: #de3c3d;
  background: #de3c3d18;
}

.tag-list span:nth-of-type(6n + 6) {
  color: #b984df;
  background: #b984df18;
}

.ot-article {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 5.88rem;
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 0.88rem;
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
}

.only-next .art-item {
  grid-column: 2;
}

.art-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background: linear-gradient(135deg, #5d6d7e, #8ea4b8) center / cover;
  color: #fff;
  text-decoration: none;
}

.art-item.is-older {
  background: linear-gradient(135deg, #3e6b68, #7eb8b0);
}

.art-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 28%);
  backdrop-filter: blur(0.36rem);
  transition: 0.18s;
}

.art-item:hover::before,
.art-item:focus-visible::before {
  background: rgb(0 0 0 / 18%);
  backdrop-filter: blur(0);
}

.art-item span {
  position: relative;
  z-index: 1;
  font-size: 0.875rem;
  line-height: 1.6;
  text-align: center;
}

.art-item:focus-visible {
  outline: 2px solid var(--vh-main-color);
  outline-offset: -3px;
}

@media (max-width: 999px) {
  .post > header h1 {
    font-size: 1.36rem;
  }
}

@media (max-width: 640px) {
  .ot-article {
    grid-template-columns: 1fr;
    height: auto;
  }

  .only-next .art-item {
    grid-column: auto;
  }

  .art-item {
    min-height: 4.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .art-item::before {
    transition: none;
  }
}
</style>
