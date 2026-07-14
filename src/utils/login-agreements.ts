const AGREEMENT_WEBVIEW_PATH = '/uni_modules/uni-id-pages/pages/common/webview/webview'

export const DEFAULT_AGREEMENT_ACCEPTED = false

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

export interface AgreementGatedLoginOptions<T> {
  type: string
  needAgreements: boolean
  isAgreed: () => boolean
  openPopup: (onConfirm: () => void) => T
  login: () => T
}

export function runLoginWithAgreementGate<T>({
  type,
  needAgreements,
  isAgreed,
  openPopup,
  login,
}: AgreementGatedLoginOptions<T>): T {
  if (!shouldBlockLoginForAgreements(type, needAgreements, isAgreed())) {
    return login()
  }

  let retried = false
  return openPopup(() => {
    if (retried || !isAgreed()) return
    retried = true
    login()
  })
}
