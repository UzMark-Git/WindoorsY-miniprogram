<script setup lang="ts">
import { onPageScroll, onShow } from '@dcloudio/uni-app'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import { applyTabBarScroll, createTabBarScrollState, resetTabBar } from '../../utils/tab-bar-scroll'
const scrollState = createTabBarScrollState()
onShow(() => resetTabBar(scrollState, uni))
onPageScroll(({ scrollTop }) => applyTabBarScroll(scrollState, scrollTop, uni))
</script>

<template><view class="page"><PrimaryPageIntro kicker="TEN-YEAR WARRANTY" title="十年质保服务" lead="真实验收、清晰期限，让长期服务有据可查" /><view class="promise"><text class="years">10</text><view><text class="heading">十年质保体系</text><text class="copy">质保信息将在项目竣工并通过验收后，由门店核验并公开。</text></view></view><view class="notice">服务查询功能将在验收与质保数据链路接入后开放。</view></view></template>

<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.promise{display:flex;gap:28rpx;align-items:center;margin:34rpx 30rpx;padding:42rpx;border-radius:22rpx;background:#fff}.years{font-family:Georgia,serif;color:#a57941;font-size:82rpx;font-weight:700}.heading,.copy{display:block}.heading{color:#203832;font-size:30rpx;font-weight:650}.copy{margin-top:12rpx;color:#7b8883;font-size:23rpx;line-height:1.7}.notice{margin:0 30rpx;padding:25rpx;border:1rpx solid #dce4e1;border-radius:16rpx;text-align:center;color:#6f7e79;font-size:23rpx}</style>
