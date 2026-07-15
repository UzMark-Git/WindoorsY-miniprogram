<script setup lang="ts">
import { onPageScroll, onShow } from '@dcloudio/uni-app'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import { navigateToLegalPage } from '../../utils/legal-navigation'
import { applyTabBarScroll, createTabBarScrollState, resetTabBar } from '../../utils/tab-bar-scroll'
const scrollState = createTabBarScrollState()
onShow(() => resetTabBar(scrollState, uni))
onPageScroll(({ scrollTop }) => applyTabBarScroll(scrollState, scrollTop, uni))
function login(){uni.navigateTo({url:'/uni_modules/uni-id-pages/pages/login/login'})}
function openLegal(url:string){navigateToLegalPage(url,uni)}
</script>

<template><view class="page"><PrimaryPageIntro kicker="MY WINDOORS" title="我的" lead="管理登录状态、预约记录与服务入口" /><view class="account"><view class="avatar">我</view><view class="account-copy"><text>登录后查看我的预约</text><text>预约信息仅对当前登录账号可见</text></view><button @click="login">微信登录</button></view><view class="menu"><view @click="openLegal('/pages/legal/service-agreement')"><text>用户服务协议</text><text>›</text></view><view @click="openLegal('/pages/legal/privacy-policy')"><text>隐私政策</text><text>›</text></view></view></view></template>

<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.account{margin:34rpx 30rpx;padding:32rpx;border-radius:22rpx;background:#fff}.avatar{display:flex;width:88rpx;height:88rpx;border-radius:50%;align-items:center;justify-content:center;color:#a57941;background:#f5eee4;font-size:30rpx}.account-copy{margin:22rpx 0}.account-copy text{display:block}.account-copy text:first-child{color:#203832;font-size:30rpx;font-weight:650}.account-copy text:last-child{margin-top:10rpx;color:#88948f;font-size:22rpx}.account button{border:0;border-radius:14rpx;color:#fff;background:#1f5a4d;font-size:26rpx}.account button::after{border:0}.menu{margin:0 30rpx;border-radius:22rpx;overflow:hidden;background:#fff}.menu view{display:flex;justify-content:space-between;padding:30rpx 32rpx;border-bottom:1rpx solid #edf0ee;color:#314a43;font-size:26rpx}.menu view:last-child{border-bottom:0}.menu view text:last-child{color:#a2aca8}</style>
