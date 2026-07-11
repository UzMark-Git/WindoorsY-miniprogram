export type DetailFailure = { status: 'empty' | 'offline' | 'error'; retryable: boolean }

export function classifyDetailError(error: unknown): DetailFailure {
  const candidate = error as { errCode?: unknown; message?: unknown }
  const text = `${candidate?.errCode || ''} ${candidate?.message || String(error)}`
  if (/CONTENT_NOT_FOUND/.test(text)) return { status: 'empty', retryable: false }
  if (/network|offline|网络/i.test(text)) return { status: 'offline', retryable: true }
  return { status: 'error', retryable: true }
}
