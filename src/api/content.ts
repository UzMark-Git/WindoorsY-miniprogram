import type { HomeContent, ProductCategory, ProductDetail, ProductListResult, SearchContentType, SearchDiscovery, SearchGroup, SearchResult, SiteDetail, SiteFilters, SiteListResult, SiteStage, StaffDetail, WarrantyDetail, WarrantyListResult, ServiceListResult, WarrantyStatus } from '../types/domain'
import type { WebsiteHome } from '@windoors/shared'

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

export type ProductQuery = { page?: number; pageSize?: number; storeId?: string; category?: ProductCategory }
export type NormalizedProductQuery = { page: number; pageSize: number; storeId?: string; category?: ProductCategory }
export type SearchQuery = { keyword:string;storeId:string;type?:SearchContentType;page?:number;pageSize?:number }
export type NormalizedSearchQuery = { keyword:string;storeId:string;type?:SearchContentType;page:number;pageSize:number }
export type WarrantyQuery = { page?:number;pageSize?:number;storeId?:string }
export type NormalizedWarrantyQuery = { page:number;pageSize:number;storeId?:string }
export type ServiceQuery = { page?:number;pageSize?:number;storeId?:string;district?:string;type?:'construction'|'warranty';stage?:SiteStage;warranty_status?:WarrantyStatus }
export type NormalizedServiceQuery = { page:number;pageSize:number;storeId?:string;district?:string;type?:'construction'|'warranty';stage?:SiteStage;warranty_status?:WarrantyStatus }
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
  return {
    ...(storeId ? { storeId } : {}),
    ...(district ? { district } : {}),
    ...(input.stage ? { stage: input.stage } : {}),
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

export function normalizeSearchQuery(input: SearchQuery): NormalizedSearchQuery {
  const keyword=String(input.keyword||'').trim(),storeId=String(input.storeId||'').trim()
  if(keyword.length<2)throw new Error('请至少输入2个字符')
  if(keyword.length>30)throw new Error('搜索关键词最多输入30个字符')
  if(!storeId)throw new Error('门店参数无效')
  const page=Number.isFinite(input.page)?Math.max(1,Math.trunc(input.page!)):1,pageSize=Number.isFinite(input.pageSize)?Math.min(10,Math.max(1,Math.trunc(input.pageSize!))):5
  return {keyword,storeId,...(input.type?{type:input.type}:{}),page,pageSize}
}

const content = () => uniCloud.importObject('content-co')

export const getHome = (storeId: string) => content().getHome(storeId)
export const listSites = (query: SiteQuery = {}) => content().listSites(normalizeSiteQuery(query))
export const getSiteFilters = (storeId?: string) => content().getSiteFilters(storeId?.trim() || undefined)
export const getSiteDetail = (siteId: string) => content().getSiteDetail(siteId)
export const getStaffProfile = (staffId: string) => content().getStaffProfile(staffId)
export const listProducts = (query: ProductQuery = {}) => content().listProducts(normalizeProductQuery(query))
export const getProductDetail = (productId: string) => content().getProductDetail(productId)
export const listWarranties = (query:WarrantyQuery={}) => content().listWarranties({page:Math.max(1,Math.trunc(query.page||1)),pageSize:Math.min(20,Math.max(1,Math.trunc(query.pageSize||10))),...(query.storeId?.trim()?{storeId:query.storeId.trim()}:{})})
export const listServices = (query:ServiceQuery={}) => content().listServices({page:Math.max(1,Math.trunc(query.page||1)),pageSize:Math.min(20,Math.max(1,Math.trunc(query.pageSize||10))),...(query.storeId?.trim()?{storeId:query.storeId.trim()}:{}),...(query.district?.trim()?{district:query.district.trim()}:{}),...(query.type?{type:query.type}:{}),...(query.stage?{stage:query.stage}:{}),...(query.warranty_status?{warranty_status:query.warranty_status}:{})})
export const getServiceFilters = (storeId?:string) => content().getServiceFilters(storeId?.trim()||undefined)
export const getWarrantyDetail = (siteId:string) => content().getWarrantyDetail(siteId)
export const getWebsiteHome = (storeId:string) => content().getWebsiteHome(storeId)
export const searchContent = (query:SearchQuery) => content().searchContent(normalizeSearchQuery(query))
export const getSearchDiscovery = (storeId:string) => content().getSearchDiscovery(storeId.trim())
