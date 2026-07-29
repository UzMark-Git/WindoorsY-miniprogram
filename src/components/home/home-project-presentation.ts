import type { ServiceSummary, SiteStage } from '../../types/domain'

export function projectBadge(serviceType: ServiceSummary['service_type'], warrantyStatus?: ServiceSummary['warranty_status']) {
  if (serviceType !== 'warranty') return '正在交付的项目'
  return warrantyStatus === 'expired' ? '质保服务已到期' : '十年质保服务中'
}

export function projectProgress(item: Pick<ServiceSummary, 'service_type' | 'warranty_status' | 'stage'>, stageLabel: Record<SiteStage, string>) {
  if (item.service_type === 'warranty') return item.warranty_status === 'expired' ? '质保服务已到期，可咨询门店' : '十年质保服务中'
  return `${stageLabel[item.stage]}，可查看现场进度`
}
