import { assertCloudRuntime } from '../config/demo-isolation'

type IdentityStoreModule = {
  mutations: {
    logout(): Promise<unknown>
  }
}

export async function logoutAccount(): Promise<unknown> {
  assertCloudRuntime('账号退出')
  const { mutations } = (await import(
    '../uni_modules/uni-id-pages/common/store.js'
  )) as IdentityStoreModule
  return mutations.logout()
}
