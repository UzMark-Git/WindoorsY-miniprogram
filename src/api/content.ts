import type { CaseCategory, HomeContent, ProductCategory, ProductDetail, ProductListResult, SearchContentType, SearchDiscovery, SearchGroup, SearchResult, SiteDetail, SiteFilters, SiteListResult, SiteStage, StaffDetail, WarrantyDetail, WarrantyListResult, ServiceListResult, WarrantyStatus } from '../types/domain'
import type { WebsiteHome } from '@windoors/shared'
import { isLocalDemoMode } from '../config/runtime'
import { mockContentRepository } from '../mock/content-repository'

export type SiteQuery = {
  page?: number
  pageSize?: number
  storeId?: string
  district?: string
  stage?: SiteStage
  keyword?: string
  category?: CaseCategory
}

export type NormalizedSiteQuery = Omit<SiteQuery, 'page' | 'pageSize'> & {
  page: number
  pageSize: number
}

export type ProductQuery = { page?: number; pageSize?: number; storeId?: string; category?: ProductCategory }
export type NormalizedProductQuery = { page: number; pageSize: number; storeId?: string; category?: ProductCategory }
export type SearchQuery = { keyword:string;storeId:string;type?:SearchContentType;page?:number;pageSize?:number }
export type NormalizedSearchQuery = { keyword:string;storeId:string;type?:SearchContentType;page:number;pageSize:number }
export type WarrantyQuery = { page?:number;pageSize?:number;storeId?:string }
export type NormalizedWarrantyQuery = { page:number;pageSize:number;storeId?:string }
export type ServiceQuery = { page?:number;pageSize?:number;storeId?:string;district?:string;type?:'construction'|'warranty';stage?:SiteStage;warranty_status?:WarrantyStatus;keyword?:string }
export type NormalizedServiceQuery = { page:number;pageSize:number;storeId?:string;district?:string;type?:'construction'|'warranty';stage?:SiteStage;warranty_status?:WarrantyStatus;keyword?:string }
export type SearchContentResult = SearchResult|{keyword:string;type:SearchContentType;group:SearchGroup}

export interface ContentRepository {
  getHome(storeId: string): Promise<HomeContent>
  listSites(query: NormalizedSiteQuery): Promise<SiteListResult>
  getSiteFilters(storeId?: string): Promise<SiteFilters>
  getSiteDetail(siteId: string): Promise<SiteDetail>
  getStaffProfile(staffId: string): Promise<StaffDetail>
  listProducts(query: NormalizedProductQuery): Promise<ProductListResult>
  getProductDetail(productId: string): Promise<ProductDetail>
  listWarranties(query:NormalizedWarrantyQuery):Promise<WarrantyListResult>
  listServices(query:NormalizedServiceQuery):Promise<ServiceListResult>
  getServiceFilters(storeId?:string):Promise<{districts:string[]}>
  getWarrantyDetail(siteId:string):Promise<WarrantyDetail>
  getWebsiteHome(storeId:string):Promise<WebsiteHome>
  searchContent(query:NormalizedSearchQuery):Promise<SearchContentResult>
  getSearchDiscovery(storeId:string):Promise<SearchDiscovery>
}

declare const uniCloud: {
  importObject(name: string): ContentRepository
}

export function normalizeSiteQuery(input: SiteQuery): NormalizedSiteQuery {
  const page = typeof input.page === 'number' && Number.isFinite(input.page) ? input.page : 1
  const pageSize = typeof input.pageSize === 'number' && Number.isFinite(input.pageSize) ? input.pageSize : 10
  const storeId = input.storeId?.trim()
  const district = input.district?.trim()
  const keyword = input.keyword?.trim()
  return {
    ...(storeId ? { storeId } : {}),
    ...(district ? { district } : {}),
    ...(input.stage ? { stage: input.stage } : {}),
    ...(keyword ? { keyword } : {}),
    ...(input.category ? { category: input.category } : {}),
    page: Math.max(1, Math.trunc(page)),
    pageSize: Math.min(20, Math.max(1, Math.trunc(pageSize))),
  }
}

export function normalizeProductQuery(input: ProductQuery): NormalizedProductQuery {
  const page = typeof input.page === 'number' && Number.isFinite(input.page) ? input.page : 1
  const pageSize = typeof input.pageSize === 'number' && Number.isFinite(input.pageSize) ? input.pageSize : 10
  const storeId = input.storeId?.trim()
  return { ...(storeId ? { storeId } : {}), ...(input.category ? { category: input.category } : {}), page: Math.max(1, Math.trunc(page)), pageSize: Math.min(20, Math.max(1, Math.trunc(pageSize))) }
}

function normalizePagination(pageValue?: number, pageSizeValue?: number) {
  const page = typeof pageValue === 'number' && Number.isFinite(pageValue) ? pageValue : 1
  const pageSize =
    typeof pageSizeValue === 'number' && Number.isFinite(pageSizeValue) ? pageSizeValue : 10
  return {
    page: Math.max(1, Math.trunc(page)),
    pageSize: Math.min(20, Math.max(1, Math.trunc(pageSize))),
  }
}

export function normalizeWarrantyQuery(input: WarrantyQuery): NormalizedWarrantyQuery {
  const storeId = input.storeId?.trim()
  return {
    ...normalizePagination(input.page, input.pageSize),
    ...(storeId ? { storeId } : {}),
  }
}

export function normalizeServiceQuery(input: ServiceQuery): NormalizedServiceQuery {
  const storeId = input.storeId?.trim()
  const district = input.district?.trim()
  const keyword = input.keyword?.trim()
  return {
    ...normalizePagination(input.page, input.pageSize),
    ...(storeId ? { storeId } : {}),
    ...(district ? { district } : {}),
    ...(input.type ? { type: input.type } : {}),
    ...(input.stage ? { stage: input.stage } : {}),
    ...(input.warranty_status ? { warranty_status: input.warranty_status } : {}),
    ...(keyword ? { keyword } : {}),
  }
}

export function normalizeSearchQuery(input: SearchQuery): NormalizedSearchQuery {
  const keyword=String(input.keyword||'').trim(),storeId=String(input.storeId||'').trim()
  if(keyword.length<2)throw new Error('请至少输入2个字符')
  if(keyword.length>30)throw new Error('搜索关键词最多输入30个字符')
  if(!storeId)throw new Error('门店参数无效')
  const page=Number.isFinite(input.page)?Math.max(1,Math.trunc(input.page!)):1,pageSize=Number.isFinite(input.pageSize)?Math.min(10,Math.max(1,Math.trunc(input.pageSize!))):5
  return {keyword,storeId,...(input.type?{type:input.type}:{}),page,pageSize}
}

const content = () => uniCloud.importObject('content-co')
const provider = (): ContentRepository => isLocalDemoMode() ? mockContentRepository : content()

export const getHome = (storeId: string) => provider().getHome(storeId)
export const listSites = (query: SiteQuery = {}) => provider().listSites(normalizeSiteQuery(query))
export const getSiteFilters = (storeId?: string) => provider().getSiteFilters(storeId?.trim() || undefined)
export const getSiteDetail = (siteId: string) => provider().getSiteDetail(siteId)
export const getStaffProfile = (staffId: string) => provider().getStaffProfile(staffId)
export const listProducts = (query: ProductQuery = {}) => provider().listProducts(normalizeProductQuery(query))
export const getProductDetail = (productId: string) => provider().getProductDetail(productId)
export const listWarranties = (query:WarrantyQuery={}) => provider().listWarranties(normalizeWarrantyQuery(query))
export const listServices = (query:ServiceQuery={}) => provider().listServices(normalizeServiceQuery(query))
export const getServiceFilters = (storeId?:string) => provider().getServiceFilters(storeId?.trim()||undefined)
export const getWarrantyDetail = (siteId:string) => provider().getWarrantyDetail(siteId)
export const getWebsiteHome = (storeId:string) => provider().getWebsiteHome(storeId)
export const searchContent = (query:SearchQuery) => provider().searchContent(normalizeSearchQuery(query))
export const getSearchDiscovery = (storeId:string) => provider().getSearchDiscovery(storeId.trim())
