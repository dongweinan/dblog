export interface Article {
  id: string
  title: string
  summary: string
  date: string
  category: string
  tags: string[]
}

export const CATEGORY_COLORS: Record<string, string> = {
  随笔: '#3d7eff',
  前端: '#0d9488',
  阅读: '#c27803',
  记录: '#64748b',
}

export function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? '#3d7eff'
}

export function formatArticleDate(date: string) {
  return date.replaceAll('-', '.')
}
