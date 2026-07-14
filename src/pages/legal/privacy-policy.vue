<script setup lang="ts">
import LegalDocument from '../../components/legal-document.vue'
import { PRIVACY_POLICY } from '../../config/legal'
import { openWechatPolicy as openWechatPrivacyPolicy } from '../../utils/legal-navigation'
import type { WechatPrivacyClient } from '../../utils/wechat-privacy'

declare const wx: WechatPrivacyClient

async function openWechatPolicy() {
  // #ifdef MP-WEIXIN
  await openWechatPrivacyPolicy(wx, (options) => uni.showToast(options))
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '请在微信小程序中查看微信隐私保护指引', icon: 'none' })
  // #endif
}
</script>

<template>
  <view>
    <LegalDocument :document="PRIVACY_POLICY" />
    <view class="official"><button @click="openWechatPolicy">查看微信隐私保护指引</button></view>
  </view>
</template>

<style scoped>
.official { padding: 0 32rpx 80rpx; background: #f7f8f7; }
.official button { color: #27433c; border: 1rpx solid #9aaca6; background: #fff; font-size: 27rpx; }
.official button::after { border: 0; }
</style>
