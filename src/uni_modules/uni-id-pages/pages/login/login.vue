<script>
export default {
  onLoad(options = {}) {
    const query = options.uniIdRedirectUrl
      ? `?uniIdRedirectUrl=${encodeURIComponent(options.uniIdRedirectUrl)}`
      : ''
    uni.redirectTo({ url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd${query}` })
  }
}
</script>

<template><view class="auth-loading">正在打开安全登录…</view></template>
<style>.auth-loading { padding: 96rpx 32rpx; text-align: center; color: #666; }</style>
