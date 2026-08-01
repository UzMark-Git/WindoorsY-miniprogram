import type { ServiceQuery } from '../../api/content'

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
  return {
    storeId: storeId.trim(),
    type: 'warranty',
    warranty_status: 'active',
    page: 1,
    pageSize: 6,
  }
}

export function warrantyDetailUrl(id: string): string {
  return `/pages-sub/services/detail?id=${encodeURIComponent(id)}`
}

export function formatWarrantyDate(value?: number): string {
  return value ? new Date(value).toLocaleDateString('zh-CN') : '以质保凭证为准'
}
