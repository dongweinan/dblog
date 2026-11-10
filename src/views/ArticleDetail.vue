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
          <div class="markdown-body" v-html="renderedContent" />
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { fetchPost } from '@/api/posts'
import type { Article } from '@/types/article'

const route = useRoute()
const article = ref<Article | null>(null)

/** 转义 HTML 特殊字符，防止未识别语言的代码块注入标签 */
function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
  typographer: true,
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch {
        /* 忽略高亮失败 */
      }
    }
    return '<pre class="hljs"><code>' + escapeHtml(str) + '</code></pre>'
  },
})

/** 把 article.content（Markdown）渲染为 HTML */
const renderedContent = computed(() => md.render(article.value?.content ?? ''))

/** 去掉 Markdown 语法符号后统计正文字数 */
function stripMarkdown(source: string) {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`_\-[\]:!()<>|]/g, '')
    .replace(/\s+/g, '')
}

const charCount = computed(
  () =>
    stripMarkdown(article.value?.content ?? article.value?.summary ?? '')
      .length,
)

watch(
  () => route.params.id,
  async (id) => {
    if (typeof id !== 'string') {
      article.value = null
      return
    }
    article.value = null
    try {
      article.value = await fetchPost(id)
    } catch (err) {
      console.error('加载文章详情失败', err)
      article.value = null
    }
  },
  { immediate: true },
)

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

.markdown-body {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--vh-font-color);
  word-break: break-word;
}

.markdown-body > :first-child {
  margin-top: 0;
}

.markdown-body > :last-child {
  margin-bottom: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin: 1.5em 0 0.7em;
  line-height: 1.4;
  color: var(--text-primary);
}

.markdown-body :deep(h1) {
  font-size: 1.55em;
}

.markdown-body :deep(h2) {
  font-size: 1.3em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--vh-card-line);
}

.markdown-body :deep(h3) {
  font-size: 1.12em;
}

.markdown-body :deep(p) {
  margin: 0.9em 0;
}

.markdown-body :deep(a) {
  color: var(--vh-main-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.markdown-body :deep(a:hover) {
  border-bottom-color: currentColor;
}

.markdown-body :deep(strong) {
  color: var(--text-primary);
  font-weight: 700;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.9em 0;
  padding-left: 1.5em;
}

.markdown-body :deep(li) {
  margin: 0.3em 0;
}

.markdown-body :deep(li > p) {
  margin: 0;
}

.markdown-body :deep(blockquote) {
  margin: 1em 0;
  padding: 0.4em 1em;
  border-left: 3px solid var(--vh-main-color);
  background: var(--vh-row-hover);
  border-radius: 0 8px 8px 0;
  color: var(--vh-font-66);
}

.markdown-body :deep(blockquote p) {
  margin: 0.4em 0;
}

.markdown-body :deep(code) {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85em;
  background: var(--vh-row-hover);
  color: #d63384;
}

.markdown-body :deep(pre) {
  margin: 1em 0;
  padding: 0.9rem 1rem;
  overflow: auto;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.6;
}

.markdown-body :deep(pre code) {
  padding: 0;
  border-radius: 0;
  font-size: inherit;
  background: transparent;
  color: inherit;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
}

.markdown-body :deep(hr) {
  margin: 1.8em 0;
  border: none;
  height: 1px;
  background: var(--vh-card-line);
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 1em 0;
  border-collapse: collapse;
  font-size: 0.92em;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 0.5em 0.8em;
  border: 1px solid var(--vh-card-line);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--vh-row-hover);
  color: var(--text-primary);
}

.markdown-body :deep(td) {
  background: transparent;
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

@media (max-width: 999px) {
  .post > header h1 {
    font-size: 1.36rem;
  }
}
</style>
