<script setup lang="ts">
import { DEMO_MODE_LABEL, isLocalDemoMode } from '../config/runtime'
</script>

<template>
  <view v-if="isLocalDemoMode()" class="demo-badge">{{ DEMO_MODE_LABEL }}</view>
</template>

<style scoped>
.demo-badge{position:fixed;right:18rpx;top:calc(18rpx + env(safe-area-inset-top));z-index:99;padding:8rpx 15rpx;border-radius:20rpx;color:#72501f;background:rgba(250,237,211,.92);font-size:19rpx;pointer-events:none}
</style>
