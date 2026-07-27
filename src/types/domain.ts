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
    display_group?: SiteDisplayGroup
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
  service_regions?: ServiceRegion[]
  sort_order: number
}

export interface ServiceRegion { code:string;province:string;city:string;district:string }
export interface StaffDetail extends StaffProfile { related_sites:ServiceSummary[] }

export type SiteStage = 'measuring' | 'designing' | 'installing' | 'completed'
export type SiteDisplayGroup = 'case' | 'service'

export interface SiteUpdate extends ContentRecord {
  site_id: string
  title: string
  content: string
  media: string[]
  sort_order?: number
  occurred_at?: number
  stage?: SiteStage
  quality_tags?: string[]
  next_step?: string
  staff_ids?: string[]
}

export interface HomeContent {
  store: StoreSummary
  cases: SiteSummary[]
  projects: ServiceSummary[]
  staff: StaffProfile[]
  warranty?: WarrantySummary
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
  scenarios?: string[]
  sort_order: number
}

export interface ProductDetail extends ProductSummary { related_sites:ServiceSummary[] }
export interface ProductListResult { items: ProductSummary[]; page: number; pageSize: number }

export interface SiteListResult {
  items: SiteSummary[]
  page: number
  pageSize: number
}

export type SearchContentType = 'products'|'sites'|'construction'|'warranties'
export interface SearchItem { id:string;type:SearchContentType;title:string;summary:string;image:string;meta:string }
export interface SearchGroup { items:SearchItem[];page:number;pageSize:number;hasMore:boolean }
export interface SearchResult { keyword:string;groups:Record<SearchContentType,SearchGroup> }
export interface SearchDiscovery { keywords:string[];groups:Record<SearchContentType,SearchItem[]>;contact_phone?:string }

export interface SiteFilters {
  districts: string[]
  stages: SiteStage[]
}

export type WarrantyStatus = 'active' | 'expired'
export interface WarrantySummary extends ContentRecord { title:string;cover_image:string;summary:string;district:string;area:number;store_name:string;stage:'completed';acceptance_status:'passed';accepted_at:number;warranty_years:10;warranty_expires_at:number;warranty_no:string;warranty_visible:true;warranty_description:string;warranty_status:WarrantyStatus }
export interface WarrantyDetail extends WarrantySummary { updates:SiteUpdate[];store_phone:string }
export interface WarrantyListResult { items:WarrantySummary[];page:number;pageSize:number }
export interface ServiceSummary extends SiteSummary { service_type:'construction'|'warranty';warranty_status?:WarrantyStatus;accepted_at?:number;warranty_expires_at?:number;warranty_no?:string }
export interface ServiceListResult { items:ServiceSummary[];page:number;pageSize:number }

export interface AppointmentInput {
  store_id: string
  source_type: AppointmentSourceType
  source_id: string
  name: string
  phone: string
  city: string
  need: string
}
