import identityConfig from '../uni_modules/uni-id-pages/config.js'

type IdentityCloudObject = {
  getSupportedLoginType(): Promise<{ supportedLoginType: string[] }>
  logout(): Promise<unknown>
  setPushCid(input: { pushClientId: string }): Promise<unknown>
}

const loginTypeMap: Record<string, string> = {
  smsCode: 'mobile-code',
  univerify: 'univerify',
  username: 'username-password',
  weixin: 'weixin',
  qq: 'qq',
  xiaomi: 'xiaomi',
  sinaweibo: 'sinaweibo',
  taobao: 'taobao',
  facebook: 'facebook',
  google: 'google',
  alipay: 'alipay',
  apple: 'apple',
  weixinMobile: 'weixin',
}

function identityCloud(options?: { customUI?: boolean }) {
  return uniCloud.importObject('uni-id-co', options) as unknown as IdentityCloudObject
}

export async function initializeOnlineIdentityRuntime(): Promise<void> {
  const { debug, loginTypes } = identityConfig
  const uniIdCo = identityCloud({ customUI: true })

  if (debug) {
    const { supportedLoginType } = await uniIdCo.getSupportedLoginType()
    const missing = loginTypes.filter(type => !supportedLoginType.includes(loginTypeMap[type]))
    if (missing.length) {
      console.error(
        `错误：前端启用的登录方式:${missing.join('，')};没有在服务端完成配置。配置文件路径："/uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center/uni-id/config.json"`,
      )
    }
  }

  const db = uniCloud.database()
  db.on('error', () => {})

  if (uniCloud.onRefreshToken) {
    uniCloud.onRefreshToken(() => {
      if (!uni.getPushClientId) return
      uni.getPushClientId({
        success: async ({ cid }) => {
          await uniIdCo.setPushCid({ pushClientId: cid })
        },
      })
    })
  }
}

export async function logoutOnlineIdentity(): Promise<unknown> {
  const uniIdCo = identityCloud()
  if (uniCloud.getCurrentUserInfo().tokenExpired > Date.now()) {
    try {
      await uniIdCo.logout()
    } catch (error) {
      console.error(error)
    }
  }
  uni.removeStorageSync('uni_id_token')
  uni.setStorageSync('uni_id_token_expired', 0)
  uni.setStorageSync('uni-id-pages-userInfo', {})
  uni.$emit('uni-id-pages-logout')
  return uni.redirectTo({ url: '/uni_modules/uni-id-pages/pages/login/login' })
}
