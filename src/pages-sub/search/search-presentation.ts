import type { ProductCategory } from '../../types/domain'

export const productCategoryLabels: Record<ProductCategory, string> = {
  system_window: '系统窗',
  bridge_aluminum: '断桥铝窗',
  sliding_door: '推拉门',
  sunroom: '阳光房',
  screen_accessory: '纱窗配件',
}

export function productCategoryLabel(value: string) {
  return productCategoryLabels[value as ProductCategory] || '门窗产品'
}

export function buildEmptySearchActions(phone?: string) {
  return {
    keywords: ['阳台封窗', '隔音窗', '系统窗'],
    contact: phone ? { type: 'phone' as const, phone } : { type: 'services' as const },
  }
}
