import { isLocalDemoMode } from '../config/runtime'

export const SEARCH_DISCOVERY_DATA_VERSION = '2026-07-28-v2'

export function searchDiscoveryCacheKey(storeId: string): string {
  const provider = isLocalDemoMode() ? 'demo' : 'cloud'
  return [
    'search-discovery',
    `provider=${provider}`,
    `store=${storeId.trim()}`,
    `version=${SEARCH_DISCOVERY_DATA_VERSION}`,
  ].join(':')
}
