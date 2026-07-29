import type { SiteSummary } from '../../types/domain'

export function casePresentation(item: Pick<SiteSummary, 'summary' | 'area' | 'district'>) {
  return {
    solution: item.summary || '查看方案',
    area: item.area ? `${item.area}㎡` : (item.district || '本地门窗方案'),
  }
}
