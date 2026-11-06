export interface Moment {
  id: string
  content: string
  date: string
  time: string
  weather?: string
  mood?: string
  location?: string
  images?: string[]
}

const BASE = import.meta.env.VITE_API_BASE || '/api'

/** 从响应里取出动态数组，兼容常见的几种包装结构 */
function extractList(body: unknown): Moment[] {
  if (Array.isArray(body)) return body as Moment[]
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>
    for (const key of ['list', 'data', 'moments', 'rows', 'items']) {
      const value = obj[key]
      if (Array.isArray(value)) return value as Moment[]
    }
  }
  return []
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(`请求失败：${res.status} ${path}`)
  return res.json() as Promise<T>
}

/** 动态列表：GET /api/moments */
export async function fetchMoments() {
  const body = await request<unknown>('/moments')
  return { list: extractList(body) }
}
