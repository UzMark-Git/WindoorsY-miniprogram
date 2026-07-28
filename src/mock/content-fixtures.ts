import type {
  HomeContent,
  ProductSummary,
  ServiceSummary,
  SiteDetail,
  StaffDetail,
  WarrantyDetail,
} from '../types/domain'
import type { WebsiteHome } from '@windoors/shared'

const now = Date.UTC(2026, 6, 28)
const base = {
  store_id: 'store_windoors_demo',
  status: 'published' as const,
  created_at: now,
  updated_at: now,
}
const image = '/static/demo/placeholder.png'

export const products: ProductSummary[] = [
  {
    ...base,
    _id: 'product-1',
    name: '静音系统窗',
    category: 'system_window',
    cover_image: image,
    gallery: [image],
    summary: '兼顾隔音、气密与日常通风',
    highlights: ['多腔体隔热', '多道密封'],
    specifications: ['型材壁厚 1.8mm'],
    scenarios: ['临街住宅'],
    sort_order: 1,
  },
  {
    ...base,
    _id: 'product-2',
    name: '全景系统窗',
    category: 'system_window',
    cover_image: image,
    gallery: [image],
    summary: '大玻璃视野与安全结构兼顾',
    highlights: ['开阔视野', '安全玻璃'],
    specifications: ['中空钢化玻璃'],
    scenarios: ['江景住宅'],
    sort_order: 2,
  },
  {
    ...base,
    _id: 'product-3',
    name: '断桥平开窗',
    category: 'bridge_aluminum',
    cover_image: image,
    gallery: [image],
    summary: '适合卧室与书房的基础升级',
    highlights: ['保温隔热'],
    specifications: ['PA66 隔热条'],
    scenarios: ['卧室'],
    sort_order: 3,
  },
]

const stages = ['measuring', 'designing', 'installing', 'completed', 'completed'] as const
const districts = ['红谷滩区', '东湖区', '红谷滩区', '青山湖区', '红谷滩区'] as const
const siteTitles = ['万科华侨城', '九龙湖花园', '绿地中央公园', '文创产业园', '滨江首府'] as const

export const sites: SiteDetail[] = stages.map((stage, index) => ({
  ...base,
  _id: `site-${index + 1}`,
  title: siteTitles[index],
  location: `南昌市${districts[index]}`,
  cover_image: image,
  summary: '真实门窗方案与施工记录演示',
  district: districts[index],
  area: 18 + index * 3,
  store_name: '门窗老伙计',
  stage,
  display_group: 'case',
  sort_order: index + 1,
  staff_ids: [`staff-${(index % 5) + 1}`],
  updates: [],
}))

const constructionStages = ['measuring', 'designing', 'installing', 'completed'] as const
const constructionDistricts = ['红谷滩区', '东湖区', '红谷滩区', '青山湖区'] as const
const constructionTitles = ['云境府施工记录', '湖滨花园施工记录', '九龙湖公寓施工记录', '艾溪湖别墅施工记录'] as const

export const constructionSites: SiteDetail[] = constructionStages.map((stage, index) => ({
  ...base,
  _id: `construction-${index + 1}`,
  title: constructionTitles[index],
  location: `南昌市${constructionDistricts[index]}`,
  cover_image: image,
  summary: '独立施工项目进度与现场交付记录',
  district: constructionDistricts[index],
  area: 22 + index * 4,
  store_name: '门窗老伙计',
  stage,
  display_group: 'service',
  sort_order: index + 1,
  staff_ids: [`staff-${(index % 5) + 1}`],
  updates: [],
}))

const staffNames = ['赵磊', '罗勇', '熊师傅', '陈工', '刘经理'] as const
const staffRoles = ['空间采光顾问', '门窗设计师', '安装负责人', '测量工程师', '项目经理'] as const

export const staff: StaffDetail[] = staffNames.map((name, index) => ({
  ...base,
  _id: `staff-${index + 1}`,
  name,
  avatar: image,
  role: staffRoles[index],
  bio: '负责从需求沟通到现场交付的专业服务。',
  specialties: ['现场沟通', '门窗方案'],
  service_regions: [
    {
      code: '360113',
      province: '江西省',
      city: '南昌市',
      district: '红谷滩区',
    },
  ],
  sort_order: index + 1,
  related_sites: [],
}))

export const warranties: WarrantyDetail[] = [
  {
    ...base,
    _id: 'warranty-1',
    title: '滨江首府',
    cover_image: image,
    summary: '真实门窗方案与施工记录演示',
    district: '红谷滩区',
    area: 30,
    store_name: '门窗老伙计',
    stage: 'completed',
    acceptance_status: 'passed',
    accepted_at: Date.UTC(2026, 5, 18),
    warranty_years: 10,
    warranty_expires_at: Date.UTC(2036, 5, 18),
    warranty_no: 'WD-20260618-001',
    warranty_visible: true,
    warranty_description: '覆盖合同约定范围内的安装与产品质量服务。',
    warranty_status: 'active',
    updates: [],
    store_phone: '0791-88888888',
  },
]

const constructionServices: ServiceSummary[] = constructionSites.map(
  ({ staff_ids, updates, ...site }) => ({
    ...site,
    service_type: 'construction',
  }),
)

const warrantyServices: ServiceSummary[] = warranties.map((warranty, index) => ({
  _id: warranty._id,
  store_id: warranty.store_id,
  status: warranty.status,
  created_at: warranty.created_at,
  updated_at: warranty.updated_at,
  title: warranty.title,
  location: `南昌市${warranty.district}`,
  cover_image: warranty.cover_image,
  summary: warranty.summary,
  district: warranty.district,
  area: warranty.area,
  store_name: warranty.store_name,
  stage: warranty.stage,
  display_group: 'service',
  sort_order: constructionServices.length + index + 1,
  service_type: 'warranty',
  warranty_status: warranty.warranty_status,
  accepted_at: warranty.accepted_at,
  warranty_expires_at: warranty.warranty_expires_at,
  warranty_no: warranty.warranty_no,
}))

export const services: ServiceSummary[] = [...constructionServices, ...warrantyServices]

export const home: HomeContent = {
  store: {
    ...base,
    _id: 'store_windoors_demo',
    name: '门窗老伙计',
    logo: image,
    hero_images: [image],
    address: '南昌市红谷滩区',
    phone: '0791-88888888',
  },
  cases: sites,
  projects: services,
  staff,
  warranty: warranties[0],
}

export const websiteHome: WebsiteHome = {
  store: {
    _id: home.store._id,
    store_id: home.store.store_id,
    name: home.store.name,
    logo: home.store.logo,
    hero_images: [...home.store.hero_images],
    address: home.store.address,
    phone: home.store.phone,
    description: '南昌本地门窗测量、设计、安装与十年质保服务。',
  },
  settings: {
    hero: {
      eyebrow: '就在南昌 · 欢迎来店坐坐',
      title: '门窗这件事，找个靠谱的本地人。',
      description: '测量、设计、安装、质保，我们一直都在。',
      image,
      primary_cta: '微信预约上门',
      secondary_cta: '看看邻居家的案例',
    },
    story: {
      title: '一家认真做门窗的南昌本地小店。',
      body: '把材料、工艺和费用说明白，把选择做简单。',
      owner_name: '门店负责人',
      owner_role: '本地门窗服务',
      quote: '门窗装完之后，长期服务才真正开始。',
    },
    advantages: [
      { title: '本地实体店', description: '有问题找得到人' },
      { title: '专人跟进安装', description: '从测量到交付不脱节' },
      { title: '报价讲明白', description: '材料、工艺和费用逐项说明' },
      { title: '十年质保', description: '验收建档，有凭证可查' },
    ],
    service_steps: [
      { title: '先聊聊需求', description: '照片、户型、预算都可以说。' },
      { title: '上门仔细测量', description: '看墙体、尺寸和使用习惯。' },
      { title: '方案报价讲清楚', description: '材料、五金、工艺逐项说明。' },
      { title: '安装验收建档', description: '过程记录，交付验收。' },
    ],
    featured_product_ids: products.map((item) => item._id),
    featured_site_ids: sites.map((item) => item._id),
    featured_staff_ids: staff.map((item) => item._id),
    contact: {
      business_hours: '09:00-18:00',
      miniprogram_qr: image,
      map_url: '',
    },
    seo: {
      title: '门窗老伙计｜南昌本地门窗服务',
      description: '南昌本地门窗测量、设计、安装与十年质保。',
      keywords: ['南昌门窗', '系统窗', '门窗安装'],
      og_image: image,
    },
    sections: {
      story: true,
      products: true,
      projects: true,
      service: true,
      warranty: true,
      staff: true,
      contact: true,
    },
  },
  products: products.map((item) => ({
    _id: item._id,
    name: item.name,
    category: item.category,
    cover_image: item.cover_image,
    summary: item.summary,
    highlights: [...item.highlights],
    scenarios: item.scenarios ? [...item.scenarios] : undefined,
  })),
  sites: sites.map((item) => ({
    _id: item._id,
    title: item.title,
    cover_image: item.cover_image,
    summary: item.summary,
    district: item.district,
    area: item.area,
    stage: item.stage,
    store_name: item.store_name,
  })),
  staff: staff.map((item) => ({
    _id: item._id,
    name: item.name,
    role: item.role,
    avatar: item.avatar,
    bio: item.bio,
    specialties: [...item.specialties],
  })),
  warranties: warranties.map((item) => ({
    _id: item._id,
    title: item.title,
    cover_image: item.cover_image,
    district: item.district,
    warranty_no: item.warranty_no,
    warranty_status: item.warranty_status,
    accepted_at: new Date(item.accepted_at).toISOString(),
    warranty_expires_at: new Date(item.warranty_expires_at).toISOString(),
  })),
}
