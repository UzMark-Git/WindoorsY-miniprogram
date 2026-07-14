import { openWechatPrivacyContract, type WechatPrivacyClient } from './wechat-privacy'

export interface LegalNavigator {
  navigateTo(options: { url: string }): unknown
}

export interface ToastOptions {
  title: string
  icon: 'none'
}

export type ShowToast = (options: ToastOptions) => unknown

export function navigateToLegalPage(url: string, navigator: LegalNavigator): void {
  navigator.navigateTo({ url })
}

export function showNonWechatPrivacyNotice(showToast: ShowToast): void {
  showToast({
    title: '请在微信小程序中查看微信隐私保护指引',
    icon: 'none',
  })
}

export async function openWechatPolicy(
  client: WechatPrivacyClient,
  showToast: ShowToast,
): Promise<void> {
  try {
    await openWechatPrivacyContract(client)
  } catch (error) {
    showToast({
      title: error instanceof Error ? error.message : '无法打开微信隐私保护指引',
      icon: 'none',
    })
  }
}
