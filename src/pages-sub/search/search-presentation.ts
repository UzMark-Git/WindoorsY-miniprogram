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

type SearchRequestCallbacks<Result> = {
  onStart(): void
  onSuccess(result: Result): void
  onError(error: unknown): void
  onFinish(): void
}

type SearchRequestQuery = Record<string, unknown>
type SearchRequestExecutor = (query: Readonly<SearchRequestQuery>) => Promise<unknown>

export function createSearchRequestCoordinator(execute: SearchRequestExecutor) {
  let generation = 0

  async function run<Result>(
    requestGeneration: number,
    query: SearchRequestQuery,
    callbacks: SearchRequestCallbacks<Result>,
  ): Promise<boolean> {
    const snapshot = Object.freeze({ ...query })
    callbacks.onStart()
    try {
      const result = await execute(snapshot) as Result
      if (requestGeneration !== generation) return false
      callbacks.onSuccess(result)
      return true
    } catch (error) {
      if (requestGeneration !== generation) return false
      callbacks.onError(error)
      return false
    } finally {
      if (requestGeneration === generation) callbacks.onFinish()
    }
  }

  return {
    search<Result>(query: SearchRequestQuery, callbacks: SearchRequestCallbacks<Result>) {
      return run<Result>(++generation, query, callbacks)
    },
    page<Result>(query: SearchRequestQuery, callbacks: SearchRequestCallbacks<Result>) {
      return run<Result>(generation, query, callbacks)
    },
  }
}
