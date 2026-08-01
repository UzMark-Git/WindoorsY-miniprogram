import type { ContentRequestOptions, ServiceQuery } from '../api/content'
import type { HomeContent, ServiceListResult, ServiceSummary } from '../types/domain'

export const WARRANTY_OVERVIEW_URL = '/pages-sub/warranty/overview'

export const warrantySteps = [
  { title: '竣工验收', description: '确认安装完成情况与验收结果。' },
  { title: '建立档案', description: '关联项目、门店、验收日期和服务记录。' },
  { title: '生成凭证', description: '形成可核验的质保编号、期限和范围说明。' },
  { title: '提交问题', description: '提供质保编号或手机号、问题描述及现场照片。' },
  { title: '核验处理', description: '门店判断责任范围，安排远程指导、上门检查或维修。' },
  { title: '记录归档', description: '保留处理过程与结果，便于后续查询。' },
] as const

export const warrantyPrinciples = [
  '质保期从项目验收完成并生成质保凭证之日起计算。',
  '具体期限、覆盖部件和责任范围，以该项目质保凭证及双方约定为准。',
  '门店核验问题是否属于质保范围后，再确定远程指导、上门检查或维修方案。',
  '人为损坏、擅自拆改、不可抗力、正常损耗及非本店施工部分，不直接承诺免费处理；门店仍可提供评估和可选服务方案。',
] as const

export function activeWarrantyQuery(storeId: string): ServiceQuery {
  return { storeId: storeId.trim(), type: 'warranty', warranty_status: 'active', page: 1, pageSize: 6 }
}

export function warrantyDetailUrl(id: string): string {
  return `/pages-sub/services/detail?id=${encodeURIComponent(id)}`
}

export function formatWarrantyDate(value?: number): string {
  return value ? new Date(value).toLocaleDateString('zh-CN') : '以质保凭证为准'
}

type CaseStatus = 'loading' | 'ready' | 'empty' | 'error'
type PhoneStatus = 'loading' | 'ready' | 'empty' | 'error'

export type WarrantyOverviewDependencies = {
  listServices: (query: ServiceQuery, options?: ContentRequestOptions) => Promise<ServiceListResult>
  getHome: (storeId: string, options?: ContentRequestOptions) => Promise<HomeContent>
  makePhoneCall: (phoneNumber: string) => void
  showToast: (message: string) => void
}

export type WarrantyOverviewState = {
  cases: ServiceSummary[]
  caseStatus: CaseStatus
  phone: string
  phoneStatus: PhoneStatus
}

const silentRequest: ContentRequestOptions = { customUI: true }

export function createWarrantyOverviewController(dependencies: WarrantyOverviewDependencies, storeId: string) {
  const state: WarrantyOverviewState = { cases: [], caseStatus: 'loading', phone: '', phoneStatus: 'loading' }

  async function loadCases() {
    state.caseStatus = 'loading'
    try {
      const result = await dependencies.listServices(activeWarrantyQuery(storeId), silentRequest)
      state.cases = result.items.slice(0, 6)
      state.caseStatus = state.cases.length ? 'ready' : 'empty'
    } catch {
      state.cases = []
      state.caseStatus = 'error'
    }
  }

  async function loadPhone() {
    state.phoneStatus = 'loading'
    try {
      state.phone = (await dependencies.getHome(storeId, silentRequest)).store.phone.trim()
      state.phoneStatus = state.phone ? 'ready' : 'empty'
    } catch {
      state.phone = ''
      state.phoneStatus = 'error'
    }
  }

  function callWarranty() {
    if (state.phoneStatus === 'ready' && state.phone) {
      dependencies.makePhoneCall(state.phone)
      return
    }
    if (state.phoneStatus === 'empty') {
      dependencies.showToast('门店电话暂未配置，请使用微信客服')
      return
    }
    if (state.phoneStatus === 'error') dependencies.showToast('门店电话加载失败，请重试')
  }

  return { state, loadCases, loadPhone, callWarranty }
}
