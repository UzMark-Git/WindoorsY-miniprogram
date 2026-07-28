import { isCloudRuntimeEnabled } from './demo-isolation'

type IdentityRuntimeModule = {
  default?: () => void
}

export type IdentityRuntimeLoader = () => Promise<IdentityRuntimeModule>

const loadIdentityRuntime: IdentityRuntimeLoader = () =>
  import('../uni_modules/uni-id-pages/init.js')

export async function initializeIdentityRuntime(
  loader: IdentityRuntimeLoader = loadIdentityRuntime,
): Promise<'initialized' | 'skipped'> {
  if (!isCloudRuntimeEnabled()) return 'skipped'
  const module = await loader()
  module.default?.()
  return 'initialized'
}
