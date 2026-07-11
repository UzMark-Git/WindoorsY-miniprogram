export type ContentStatus = 'draft' | 'published' | 'unpublished'

export type AppointmentSourceType = 'store' | 'site' | 'staff' | 'product'

interface ContentRecord {
  _id: string
  store_id: string
  status: ContentStatus
  created_at: number
  updated_at: number
}

export interface StoreSummary extends ContentRecord {
  name: string
  logo: string
  city: string
  address: string
  phone: string
}

export interface SiteSummary extends ContentRecord {
  title: string
  cover: string
  store_name: string
  city: string
  district: string
  area: number
  stage: string
}

export interface SiteDetail extends SiteSummary {
  address: string
  house_type: string
  product_ids: string[]
  staff_id: string
  media: string[]
  stages: string[]
  current_stage: number
}

export interface StaffProfile extends ContentRecord {
  name: string
  avatar: string
  position: string
  introduction: string
  service_areas: string[]
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
