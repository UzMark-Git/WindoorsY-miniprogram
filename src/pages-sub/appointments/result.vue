<script setup lang="ts">
import { getDemoPageBlock } from '../../config/demo-isolation'

const demoBlock = getDemoPageBlock('预约提交结果')
function home(){uni.reLaunch({url:'/pages/index/index'})}
</script>
<template><view class="page"><template v-if="demoBlock"><view class="mark demo">i</view><text class="title">演示模式未提交预约</text><text class="copy">{{demoBlock}}，不会显示虚假的成功结果。</text></template><template v-else><view class="mark">✓</view><text class="title">预约提交成功</text><text class="copy">我们已收到您的需求，门店顾问会尽快与您联系。</text></template><button @click="home">返回首页</button></view></template>
<style scoped>.page{min-height:100vh;padding:180rpx 50rpx;text-align:center;background:#f2f5f3}.mark{width:120rpx;height:120rpx;margin:auto;border-radius:50%;color:#fff;background:#24564a;font-size:70rpx;line-height:120rpx}.title{display:block;margin-top:38rpx;color:#183b32;font-size:40rpx;font-weight:650}.copy{display:block;margin:24rpx auto 70rpx;color:#75837f;font-size:26rpx;line-height:1.7}.page button{border:0;border-radius:40rpx;color:#fff;background:#24564a}.page button::after{border:0}</style>
