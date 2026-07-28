import type {
  HomeContent,
  ProductSummary,
  ServiceSummary,
  SiteDetail,
  StaffDetail,
  WarrantyDetail,
} from '../types/domain'

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
  display_group: index < 3 ? 'case' : 'service',
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

const constructionServices: ServiceSummary[] = sites.slice(0, 4).map(({ staff_ids, updates, ...site }) => ({
  ...site,
  display_group: 'service',
  service_type: 'construction',
}))

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
