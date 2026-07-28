import type { NormalizedProductQuery, NormalizedSiteQuery } from '../api/content'
import type {
  HomeContent,
  ProductDetail,
  ProductListResult,
  ServiceListResult,
  SiteDetail,
  SiteFilters,
  SiteListResult,
  SiteStage,
  StaffDetail,
  WarrantyDetail,
  WarrantyStatus,
} from '../types/domain'
import { home, products, services, sites, staff, warranties } from './content-fixtures'

export type MockServiceQuery = {
  page: number
  pageSize: number
  storeId?: string
  district?: string
  type?: 'construction' | 'warranty'
  stage?: SiteStage
  warranty_status?: WarrantyStatus
}

const page = <T>(items: T[], current: number, size: number): T[] =>
  items.slice((current - 1) * size, current * size)

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const required = <T extends { _id: string }>(items: T[], id: string): T => {
  const item = items.find((entry) => entry._id === id)
  if (!item) {
    throw new Error('内容不存在')
  }
  return clone(item)
}

export async function mockGetHome(storeId: string): Promise<HomeContent> {
  if (storeId !== home.store._id) {
    throw new Error('门店参数无效')
  }
  return clone(home)
}

export async function mockListProducts(query: NormalizedProductQuery): Promise<ProductListResult> {
  const filtered = products.filter((item) => !query.category || item.category === query.category)
  return {
    items: page(filtered, query.page, query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function mockListSites(query: NormalizedSiteQuery): Promise<SiteListResult> {
  const filtered = sites.filter(
    (item) =>
      (!query.district || item.district === query.district) &&
      (!query.stage || item.stage === query.stage),
  )
  return {
    items: page(filtered, query.page, query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function mockListServices(query: MockServiceQuery): Promise<ServiceListResult> {
  const filtered = services.filter(
    (item) =>
      (!query.district || item.district === query.district) &&
      (!query.type || item.service_type === query.type) &&
      (!query.stage || item.stage === query.stage) &&
      (!query.warranty_status || item.warranty_status === query.warranty_status),
  )
  return {
    items: page(filtered, query.page, query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export const mockGetProductDetail = async (id: string): Promise<ProductDetail> => ({
  ...required(products, id),
  related_sites: clone(services.slice(0, 2)),
})

export const mockGetSiteDetail = async (id: string): Promise<SiteDetail> => required(sites, id)

export const mockGetStaffProfile = async (id: string): Promise<StaffDetail> => required(staff, id)

export const mockGetWarrantyDetail = async (id: string): Promise<WarrantyDetail> =>
  required(warranties, id)

export const mockGetSiteFilters = async (_storeId?: string): Promise<SiteFilters> => ({
  districts: [...new Set(sites.map((item) => item.district))],
  stages: ['measuring', 'designing', 'installing', 'completed'],
})

export const mockGetServiceFilters = async (
  _storeId?: string,
): Promise<{ districts: string[] }> => ({
  districts: [...new Set(services.map((item) => item.district))],
})

export const mockContentRepository = {
  getHome: mockGetHome,
  listProducts: mockListProducts,
  listSites: mockListSites,
  listServices: mockListServices,
  getProductDetail: mockGetProductDetail,
  getSiteDetail: mockGetSiteDetail,
  getStaffProfile: mockGetStaffProfile,
  getWarrantyDetail: mockGetWarrantyDetail,
  getSiteFilters: mockGetSiteFilters,
  getServiceFilters: mockGetServiceFilters,
}
