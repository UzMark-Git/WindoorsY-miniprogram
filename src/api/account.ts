import { assertCloudRuntime } from '../config/demo-isolation'
import { logoutOnlineIdentity } from '../config/identity-adapter'

export async function logoutAccount(): Promise<unknown> {
  assertCloudRuntime('账号退出')
  return logoutOnlineIdentity()
}
