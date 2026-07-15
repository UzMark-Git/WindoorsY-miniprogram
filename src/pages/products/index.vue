<script setup lang="ts">
import { onPageScroll, onShow } from '@dcloudio/uni-app'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import { applyTabBarScroll, createTabBarScrollState, resetTabBar } from '../../utils/tab-bar-scroll'
const scrollState = createTabBarScrollState()
onShow(() => resetTabBar(scrollState, uni))
onPageScroll(({ scrollTop }) => applyTabBarScroll(scrollState, scrollTop, uni))
</script>

<template><view class="page"><PrimaryPageIntro kicker="WINDOW COLLECTION" title="门窗产品" lead="按空间与使用需求，找到适合你的门窗方案" /><view class="coming"><text class="mark">产</text><text class="heading">产品中心正在完善</text><text class="copy">下一批将接入产品分类、详情参数、图片展示和预约咨询。</text></view></view></template>

<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.coming{margin:34rpx 30rpx;padding:72rpx 42rpx;border-radius:22rpx;text-align:center;background:#fff}.mark{display:flex;width:82rpx;height:82rpx;margin:0 auto 24rpx;border-radius:50%;align-items:center;justify-content:center;color:#a57941;background:#f5eee4;font-size:30rpx}.heading,.copy{display:block}.heading{color:#203832;font-size:32rpx;font-weight:650}.copy{margin-top:18rpx;color:#7b8883;font-size:24rpx;line-height:1.8}</style>
