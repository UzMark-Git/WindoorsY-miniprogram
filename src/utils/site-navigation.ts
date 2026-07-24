export function siteDetailUrl(siteId: string): string {
  return `/pages-sub/sites/detail?id=${encodeURIComponent(siteId)}`
}

export function constructionDetailUrl(siteId: string): string {
  return `/pages-sub/construction/detail?id=${encodeURIComponent(siteId)}`
}
