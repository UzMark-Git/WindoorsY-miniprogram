export type SiteQuery = {
  page?: number
  pageSize?: number
  storeId?: string
  district?: string
  stage?: string
}

export type NormalizedSiteQuery = Omit<SiteQuery, 'page' | 'pageSize'> & {
  page: number
  pageSize: number
}

type ContentCloudObject = {
  getHome(storeId: string): Promise<unknown>
  listSites(query: NormalizedSiteQuery): Promise<unknown>
  getSiteDetail(siteId: string): Promise<unknown>
  getStaffProfile(staffId: string): Promise<unknown>
}

declare const uniCloud: {
  importObject(name: string): ContentCloudObject
}

export function normalizeSiteQuery(input: SiteQuery): NormalizedSiteQuery {
  return {
    ...input,
    page: Math.max(1, Math.trunc(input.page ?? 1)),
    pageSize: Math.min(20, Math.max(1, Math.trunc(input.pageSize ?? 10))),
  }
}

const content = () => uniCloud.importObject('content-co')

export const getHome = (storeId: string) => content().getHome(storeId)
export const listSites = (query: SiteQuery = {}) => content().listSites(normalizeSiteQuery(query))
export const getSiteDetail = (siteId: string) => content().getSiteDetail(siteId)
export const getStaffProfile = (staffId: string) => content().getStaffProfile(staffId)
