import type {
  ContentRepository,
  NormalizedProductQuery,
  NormalizedSearchQuery,
  NormalizedServiceQuery,
  NormalizedSiteQuery,
  NormalizedWarrantyQuery,
  SearchContentResult,
} from '../api/content'
import type {
  HomeContent,
  ProductDetail,
  ProductListResult,
  SearchContentType,
  SearchDiscovery,
  SearchGroup,
  SearchItem,
  ServiceListResult,
  SiteDetail,
  SiteFilters,
  SiteListResult,
  StaffDetail,
  WarrantyDetail,
  WarrantyListResult,
} from '../types/domain'
import type { WebsiteHome } from '@windoors/shared'
import {
  constructionSites,
  home,
  products,
  services,
  sites,
  staff,
  warranties,
  websiteHome,
} from './content-fixtures'

const storeId = home.store._id
const searchTypes: SearchContentType[] = ['products', 'sites', 'construction', 'warranties']
const stageLabels = {
  measuring: '复尺',
  designing: '设计',
  installing: '安装',
  completed: '已交付',
} as const

const page = <T>(items: T[], current: number, size: number): T[] =>
  items.slice((current - 1) * size, current * size)

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const validateStoreId = (value?: string): void => {
  if (value !== undefined && value.trim() !== storeId) {
    throw new Error('门店参数无效')
  }
}

const requireStoreId = (value: string): void => {
  if (value?.trim() !== storeId) {
    throw new Error('门店参数无效')
  }
}

const required = <T extends { _id: string }>(items: T[], id: string): T => {
  const item = items.find((entry) => entry._id === id)
  if (!item) {
    throw new Error('内容不存在')
  }
  return clone(item)
}

export async function mockGetHome(value: string): Promise<HomeContent> {
  requireStoreId(value)
  return clone(home)
}

export async function mockListProducts(
  query: NormalizedProductQuery,
): Promise<ProductListResult> {
  validateStoreId(query.storeId)
  const filtered = products.filter((item) => !query.category || item.category === query.category)
  return {
    items: clone(page(filtered, query.page, query.pageSize)),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function mockListSites(query: NormalizedSiteQuery): Promise<SiteListResult> {
  validateStoreId(query.storeId)
  const filtered = sites.filter(
    (item) =>
      (!query.district || item.district === query.district) &&
      (!query.stage || item.stage === query.stage),
  )
  return {
    items: clone(page(filtered, query.page, query.pageSize)),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function mockListServices(
  query: NormalizedServiceQuery,
): Promise<ServiceListResult> {
  validateStoreId(query.storeId)
  const filtered = services.filter(
    (item) =>
      (!query.district || item.district === query.district) &&
      (!query.type || item.service_type === query.type) &&
      (!query.stage || item.stage === query.stage) &&
      (!query.warranty_status || item.warranty_status === query.warranty_status),
  )
  return {
    items: clone(page(filtered, query.page, query.pageSize)),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function mockListWarranties(
  query: NormalizedWarrantyQuery,
): Promise<WarrantyListResult> {
  validateStoreId(query.storeId)
  return {
    items: clone(page(warranties, query.page, query.pageSize)),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export const mockGetProductDetail = async (id: string): Promise<ProductDetail> => ({
  ...required(products, id),
  related_sites: clone(services.slice(0, 2)),
})

export const mockGetSiteDetail = async (id: string): Promise<SiteDetail> =>
  required([...sites, ...constructionSites], id)

export const mockGetStaffProfile = async (id: string): Promise<StaffDetail> => {
  const profile = required(staff, id)
  return {
    ...profile,
    related_sites: id === 'staff-3' ? clone(services) : profile.related_sites,
  }
}

export const mockGetWarrantyDetail = async (id: string): Promise<WarrantyDetail> =>
  required(warranties, id)

export const mockGetSiteFilters = async (value?: string): Promise<SiteFilters> => {
  validateStoreId(value)
  return {
    districts: [...new Set(sites.map((item) => item.district))],
    stages: ['measuring', 'designing', 'installing', 'completed'],
  }
}

export const mockGetServiceFilters = async (
  value?: string,
): Promise<{ districts: string[] }> => {
  validateStoreId(value)
  return {
    districts: [...new Set(services.map((item) => item.district))],
  }
}

export const mockGetWebsiteHome = async (value: string): Promise<WebsiteHome> => {
  requireStoreId(value)
  return clone(websiteHome)
}

const includes = (value: string, keyword: string): boolean =>
  value.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())

const searchItems = (type: SearchContentType, keyword: string): SearchItem[] => {
  if (type === 'products') {
    return products
      .filter((item) => includes(`${item.name} ${item.summary}`, keyword))
      .map((item) => ({
        id: item._id,
        type,
        title: item.name,
        summary: item.summary,
        image: item.cover_image,
        meta: item.category,
      }))
  }

  if (type === 'sites') {
    return sites
      .filter((item) => includes(`${item.title} ${item.summary} ${item.district}`, keyword))
      .map((item) => ({
        id: item._id,
        type,
        title: item.title,
        summary: item.summary,
        image: item.cover_image,
        meta: `${item.district} · ${item.area}㎡`,
      }))
  }

  if (type === 'construction') {
    return constructionSites
      .filter((item) =>
        includes(
          `${item.title} ${item.summary} ${item.district} ${stageLabels[item.stage]}`,
          keyword,
        ),
      )
      .map((item) => ({
        id: item._id,
        type,
        title: item.title,
        summary: item.summary,
        image: item.cover_image,
        meta: `${item.district} · ${stageLabels[item.stage]}`,
      }))
  }

  return warranties
    .filter((item) =>
      includes(
        `${item.title} ${item.summary} ${item.district} ${item.warranty_no} ${item.warranty_description}`,
        keyword,
      ),
    )
    .map((item) => ({
      id: item._id,
      type,
      title: item.title,
      summary: item.warranty_description || item.summary,
      image: item.cover_image,
      meta: `${item.warranty_no} · ${item.district} · ${
        item.warranty_status === 'active' ? '质保中' : '已过质保'
      }`,
    }))
}

const searchGroup = (
  type: SearchContentType,
  keyword: string,
  current: number,
  size: number,
): SearchGroup => {
  const items = searchItems(type, keyword)
  return {
    items: clone(page(items, current, size)),
    page: current,
    pageSize: size,
    hasMore: current * size < items.length,
  }
}

export const mockSearchContent = async (
  query: NormalizedSearchQuery,
): Promise<SearchContentResult> => {
  requireStoreId(query.storeId)
  const keyword = query.keyword.trim()
  if (query.type) {
    return {
      keyword,
      type: query.type,
      group: searchGroup(query.type, keyword, query.page, query.pageSize),
    }
  }
  return {
    keyword,
    groups: Object.fromEntries(
      searchTypes.map((type) => [type, searchGroup(type, keyword, 1, query.pageSize)]),
    ) as Record<SearchContentType, SearchGroup>,
  }
}

const discoveryItems = (type: SearchContentType): SearchItem[] => {
  if (type === 'products') {
    return products.map((item) => ({
      id: item._id,
      type,
      title: item.name,
      summary: item.summary,
      image: item.cover_image,
      meta: item.category,
    }))
  }
  if (type === 'sites') {
    return sites.map((item) => ({
      id: item._id,
      type,
      title: item.title,
      summary: item.summary,
      image: item.cover_image,
      meta: `${item.district} · ${item.area}㎡`,
    }))
  }
  if (type === 'construction') {
    return constructionSites.map((item) => ({
      id: item._id,
      type,
      title: item.title,
      summary: item.summary,
      image: item.cover_image,
      meta: `${item.district} · ${stageLabels[item.stage]}`,
    }))
  }
  return warranties.map((item) => ({
    id: item._id,
    type,
    title: item.title,
    summary: item.warranty_description || item.summary,
    image: item.cover_image,
    meta: `${item.district} · ${item.warranty_status === 'active' ? '质保中' : '已过质保'}`,
  }))
}

export const mockGetSearchDiscovery = async (value: string): Promise<SearchDiscovery> => {
  requireStoreId(value)
  const groups = Object.fromEntries(
    searchTypes.map((type) => [type, clone(discoveryItems(type).slice(0, 4))]),
  ) as Record<SearchContentType, SearchItem[]>
  return {
    keywords: ['九龙湖封窗', '封窗注意事项', '十年质保'],
    groups,
    contact_phone: home.store.phone,
  }
}

export const mockContentRepository = {
  getHome: mockGetHome,
  listProducts: mockListProducts,
  listSites: mockListSites,
  listServices: mockListServices,
  listWarranties: mockListWarranties,
  getProductDetail: mockGetProductDetail,
  getSiteDetail: mockGetSiteDetail,
  getStaffProfile: mockGetStaffProfile,
  getWarrantyDetail: mockGetWarrantyDetail,
  getSiteFilters: mockGetSiteFilters,
  getServiceFilters: mockGetServiceFilters,
  getWebsiteHome: mockGetWebsiteHome,
  searchContent: mockSearchContent,
  getSearchDiscovery: mockGetSearchDiscovery,
} satisfies ContentRepository
