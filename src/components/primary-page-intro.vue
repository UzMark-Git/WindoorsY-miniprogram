<script setup lang="ts">
defineProps<{ kicker: string; title: string; lead: string }>()
</script>

<template>
  <view class="intro"><text class="kicker">{{ kicker }}</text><text class="title">{{ title }}</text><text class="lead">{{ lead }}</text></view>
</template>

<style scoped>
.intro{padding:70rpx 32rpx 42rpx;background:#183d34;color:#fff}.kicker{display:block;color:#d7aa6d;letter-spacing:4rpx;font-size:20rpx}.title{display:block;margin-top:13rpx;font-size:48rpx;font-weight:650}.lead{display:block;margin-top:15rpx;color:rgba(255,255,255,.68);font-size:24rpx;line-height:1.7}
</style>
