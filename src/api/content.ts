import type { HomeContent, SiteDetail, SiteListResult, SiteStage, StaffProfile } from '../types/domain'

export type SiteQuery = {
  page?: number
  pageSize?: number
  storeId?: string
  district?: string
  stage?: SiteStage
}

export type NormalizedSiteQuery = Omit<SiteQuery, 'page' | 'pageSize'> & {
  page: number
  pageSize: number
}

type ContentCloudObject = {
  getHome(storeId: string): Promise<HomeContent>
  listSites(query: NormalizedSiteQuery): Promise<SiteListResult>
  getSiteDetail(siteId: string): Promise<SiteDetail>
  getStaffProfile(staffId: string): Promise<StaffProfile>
}

declare const uniCloud: {
  importObject(name: string): ContentCloudObject
}

export function normalizeSiteQuery(input: SiteQuery): NormalizedSiteQuery {
  const page = typeof input.page === 'number' && Number.isFinite(input.page) ? input.page : 1
  const pageSize = typeof input.pageSize === 'number' && Number.isFinite(input.pageSize) ? input.pageSize : 10
  return {
    ...input,
    page: Math.max(1, Math.trunc(page)),
    pageSize: Math.min(20, Math.max(1, Math.trunc(pageSize))),
  }
}

const content = () => uniCloud.importObject('content-co')

export const getHome = (storeId: string) => content().getHome(storeId)
export const listSites = (query: SiteQuery = {}) => content().listSites(normalizeSiteQuery(query))
export const getSiteDetail = (siteId: string) => content().getSiteDetail(siteId)
export const getStaffProfile = (staffId: string) => content().getStaffProfile(staffId)
