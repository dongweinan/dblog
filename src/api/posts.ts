import type { Article } from '@/types/article'

const BASE = import.meta.env.VITE_API_BASE || '/api'

interface ListQuery {
  page?: number
  category?: string
}

export interface Stats {
  postCount: number
  categoryCount: number
  tagCount: number
}

/** 从响应里取出文章数组，兼容常见的几种包装结构 */
function extractList(body: unknown): Article[] {
  if (Array.isArray(body)) return body as Article[]
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>
    for (const key of ['list', 'data', 'posts', 'rows', 'items']) {
      const value = obj[key]
      if (Array.isArray(value)) return value as Article[]
    }
  }
  return []
}

/** 从响应里取出单篇文章，兼容直接返回对象或包在 data/key 里 */
function extractDetail(body: unknown): Article | null {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const obj = body as Record<string, unknown>
    if (obj.id || obj.title || Array.isArray(obj.tags) || obj.summary) {
      return obj as unknown as Article
    }
    for (const key of ['data', 'post', 'article']) {
      const value = obj[key]
      if (value && typeof value === 'object') return value as Article
    }
  }
  return null
}

/** 从响应里取出文章统计数据，兼容直接返回对象或包在 data/key 里 */
export function extractStats(body: unknown): Stats {
  const empty: Stats = { postCount: 0, categoryCount: 0, tagCount: 0 }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return empty
  let obj = body as Record<string, unknown>
  for (const key of ['data', 'stats', 'Stat']) {
    const value = obj[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      obj = value as Record<string, unknown>
      break
    }
  }
  const num = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) ? v : 0
  return {
    postCount: num(obj.postCount ?? obj.posts ?? obj.count ?? obj.total),
    categoryCount: num(obj.categoryCount ?? obj.categories),
    tagCount: num(obj.tagCount ?? obj.tags),
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(`请求失败：${res.status} ${path}`)
  return res.json() as Promise<T>
}

/** 文章列表：GET /api/posts?page=1&category=xx */
export async function fetchPosts(query: ListQuery = {}) {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.category) params.set('category', query.category)
  const qs = params.toString()
  const body = await request<unknown>(`/posts${qs ? `?${qs}` : ''}`)
  return { list: extractList(body) }
}

/** 文章详情：GET /api/posts/{id} */
export async function fetchPost(id: string) {
  const body = await request<unknown>(`/posts/${encodeURIComponent(id)}`)
  return extractDetail(body)
}

/** 文章统计：GET /api/stats */
export async function fetchStats() {
  const body = await request<unknown>('/stats')
  return extractStats(body)
}
