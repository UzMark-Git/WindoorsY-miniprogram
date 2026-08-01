import { isCloudRuntimeEnabled } from './demo-isolation'
import { initializeOnlineIdentityRuntime } from './identity-adapter'

export type IdentityRuntimeInitializer = () => void | Promise<void>

export async function initializeIdentityRuntime(
  initialize: IdentityRuntimeInitializer = initializeOnlineIdentityRuntime,
): Promise<'initialized' | 'skipped'> {
  if (!isCloudRuntimeEnabled()) return 'skipped'
  await initialize()
  return 'initialized'
}
