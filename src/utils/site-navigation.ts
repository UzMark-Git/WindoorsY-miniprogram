export function siteDetailUrl(siteId: string): string {
  return `/pages-sub/sites/detail?id=${encodeURIComponent(siteId)}`
}
