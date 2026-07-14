const AGREEMENT_WEBVIEW_PATH = '/uni_modules/uni-id-pages/pages/common/webview/webview'

export function getAgreementDestination(url: string, title: string): string {
  if (url.startsWith('/')) {
    return url
  }

  return (
    `${AGREEMENT_WEBVIEW_PATH}?url=${encodeURIComponent(url)}` +
    `&title=${encodeURIComponent(title)}`
  )
}

export function shouldBlockLoginForAgreements(
  type: string,
  needAgreements: boolean,
  agreed: boolean,
): boolean {
  return type !== 'univerify' && needAgreements && !agreed
}
