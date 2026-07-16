import type { HomeContent, ProductCategory, ProductDetail, ProductListResult, SiteDetail, SiteFilters, SiteListResult, SiteStage, StaffProfile, WarrantyDetail, WarrantyListResult } from '../types/domain'

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

type ContentCloudObject = {
  getHome(storeId: string): Promise<HomeContent>
  listSites(query: NormalizedSiteQuery): Promise<SiteListResult>
  getSiteFilters(storeId?: string): Promise<SiteFilters>
  getSiteDetail(siteId: string): Promise<SiteDetail>
  getStaffProfile(staffId: string): Promise<StaffProfile>
  listProducts(query: NormalizedProductQuery): Promise<ProductListResult>
  getProductDetail(productId: string): Promise<ProductDetail>
  listWarranties(query:{page:number;pageSize:number;storeId?:string}):Promise<WarrantyListResult>
  getWarrantyDetail(siteId:string):Promise<WarrantyDetail>
}

declare const uniCloud: {
  importObject(name: string): ContentCloudObject
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

const content = () => uniCloud.importObject('content-co')

export const getHome = (storeId: string) => content().getHome(storeId)
export const listSites = (query: SiteQuery = {}) => content().listSites(normalizeSiteQuery(query))
export const getSiteFilters = (storeId?: string) => content().getSiteFilters(storeId?.trim() || undefined)
export const getSiteDetail = (siteId: string) => content().getSiteDetail(siteId)
export const getStaffProfile = (staffId: string) => content().getStaffProfile(staffId)
export const listProducts = (query: ProductQuery = {}) => content().listProducts(normalizeProductQuery(query))
export const getProductDetail = (productId: string) => content().getProductDetail(productId)
export const listWarranties = (query:{page?:number;pageSize?:number;storeId?:string}={}) => content().listWarranties({page:Math.max(1,Math.trunc(query.page||1)),pageSize:Math.min(20,Math.max(1,Math.trunc(query.pageSize||10))),...(query.storeId?.trim()?{storeId:query.storeId.trim()}:{})})
export const getWarrantyDetail = (siteId:string) => content().getWarrantyDetail(siteId)
