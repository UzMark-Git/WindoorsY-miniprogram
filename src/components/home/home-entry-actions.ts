export type HomeSuggestionAction =
  | { label: string; type: 'search'; keyword: string }
  | { label: string; type: 'private'; entry: 'progress' | 'warranty' }

export const homeSuggestionActions: HomeSuggestionAction[] = [
  { label: '九龙湖封窗', type: 'search', keyword: '九龙湖封窗' },
  { label: '封窗注意事项', type: 'search', keyword: '封窗注意事项' },
  { label: '我的施工进度', type: 'private', entry: 'progress' },
]

export type WarrantyHomeTarget = { kind: 'detail'; id: string } | { kind: 'services' }

export function warrantyHomeTarget(warrantyId?: string): WarrantyHomeTarget {
  return warrantyId ? { kind: 'detail', id: warrantyId } : { kind: 'services' }
}
