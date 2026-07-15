export type ContentStatus = 'draft' | 'published' | 'offline'

export type AppointmentSourceType = 'store' | 'site' | 'staff' | 'product'

export interface ContentRecord {
  _id: string
  store_id: string
  status: ContentStatus
  created_at: number
  updated_at: number
}

export interface StoreSummary extends ContentRecord {
  name: string
  logo: string
  hero_images: string[]
  address: string
  phone: string
}

export interface SiteSummary extends ContentRecord {
  title: string
  location: string
  cover_image: string
  summary: string
  district: string
  area: number
  store_name: string
  stage: SiteStage
  sort_order: number
}

export interface SiteDetail extends SiteSummary {
  staff_ids: string[]
  updates: SiteUpdate[]
}

export interface StaffProfile extends ContentRecord {
  name: string
  avatar: string
  role: string
  bio: string
  specialties: string[]
  sort_order: number
}

export type SiteStage = 'measuring' | 'designing' | 'installing' | 'completed'

export interface SiteUpdate extends ContentRecord {
  site_id: string
  title: string
  content: string
  media: string[]
  sort_order: number
}

export interface HomeContent {
  store: StoreSummary
  sites: SiteSummary[]
  staff: StaffProfile[]
  products: ProductSummary[]
}

export type ProductCategory = 'system_window' | 'bridge_aluminum' | 'sliding_door' | 'sunroom' | 'screen_accessory'

export interface ProductSummary extends ContentRecord {
  name: string
  category: ProductCategory
  cover_image: string
  gallery: string[]
  summary: string
  highlights: string[]
  specifications: string[]
  scenarios: string[]
  sort_order: number
}

export type ProductDetail = ProductSummary
export interface ProductListResult { items: ProductSummary[]; page: number; pageSize: number }

export interface SiteListResult {
  items: SiteSummary[]
  page: number
  pageSize: number
}

export interface SiteFilters {
  districts: string[]
  stages: SiteStage[]
}

export interface AppointmentInput {
  store_id: string
  source_type: AppointmentSourceType
  source_id: string
  name: string
  phone: string
  city: string
  need: string
}
