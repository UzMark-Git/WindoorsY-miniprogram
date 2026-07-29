import { isLocalDemoMode } from './runtime'

export const DEMO_CLOUD_ERROR_CODE = 'DEMO_CLOUD_DISABLED' as const
export const DEMO_CLOUD_MESSAGE = '演示模式仅展示本地内容，不连接云端服务' as const

export class DemoCloudAccessError extends Error {
  readonly errCode = DEMO_CLOUD_ERROR_CODE
  readonly errMsg: string

  constructor(feature = '该功能') {
    const message = `演示模式不提供${feature}`
    super(message)
    this.name = 'DemoCloudAccessError'
    this.errMsg = message
  }
}

export function isCloudRuntimeEnabled(): boolean {
  return !isLocalDemoMode()
}

export function assertCloudRuntime(feature?: string): void {
  if (!isCloudRuntimeEnabled()) {
    throw new DemoCloudAccessError(feature)
  }
}

type DemoToastClient = {
  showToast(options: { title: string; icon: 'none' }): unknown
}

export function showDemoUnavailable(client: DemoToastClient, feature = '该功能'): boolean {
  if (isCloudRuntimeEnabled()) return false
  client.showToast({ title: `演示模式不提供${feature}`, icon: 'none' })
  return true
}

export function getDemoPageBlock(feature: string): string {
  return isCloudRuntimeEnabled() ? '' : `演示模式不连接${feature}`
}

export async function runCloudOnly<T>(
  operation: () => Promise<T>,
  demoValue: () => T | Promise<T>,
): Promise<T> {
  return isCloudRuntimeEnabled() ? operation() : demoValue()
}
