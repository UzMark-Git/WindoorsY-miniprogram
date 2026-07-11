<script setup lang="ts">
import { APP_NAME } from '../../config/app'
</script>

<template>
  <view class="page">
    <text class="title">{{ APP_NAME }}</text>
  </view>
</template>

<style scoped>
.page { padding: 48rpx 32rpx; }
.title { font-size: 44rpx; font-weight: 600; }
</style>
