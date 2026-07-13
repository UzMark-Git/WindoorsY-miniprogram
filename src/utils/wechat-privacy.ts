export interface WechatPrivacyClient {
  openPrivacyContract?: (options: {
    success: () => void
    fail: (error: { errMsg?: string }) => void
  }) => void
}

export function openWechatPrivacyContract(client: WechatPrivacyClient): Promise<void> {
  if (typeof client.openPrivacyContract !== 'function') {
    return Promise.reject(new Error('当前微信版本不支持打开隐私保护指引'))
  }

  return new Promise((resolve, reject) => {
    client.openPrivacyContract?.({
      success: resolve,
      fail: (error) => reject(new Error(`打开微信隐私保护指引失败：${error.errMsg || '未知错误'}`)),
    })
  })
}
