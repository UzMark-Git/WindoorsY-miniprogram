<script setup lang="ts">
defineProps<{ status: 'loading' | 'empty' | 'error' | 'offline'; message?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <view class="state" :class="`state--${status}`">
    <view v-if="status === 'loading'" class="spinner" />
    <text class="icon">{{ status === 'empty' ? '○' : status === 'offline' ? '⌑' : status === 'error' ? '!' : '' }}</text>
    <text class="message">{{ message || (status === 'loading' ? '正在加载…' : '暂无内容') }}</text>
    <button v-if="status === 'error' || status === 'offline'" class="retry" @click="$emit('retry')">重新加载</button>
  </view>
</template>

<style scoped>
.state { min-height: 280rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22rpx; color: #71807b; }
.icon { font-size: 58rpx; color: #b1bdb9; }
.message { font-size: 27rpx; }
.spinner { width: 42rpx; height: 42rpx; border: 5rpx solid #dce6e3; border-top-color: #245c50; border-radius: 50%; animation: spin .8s linear infinite; }
.retry { margin: 4rpx 0 0; padding: 0 38rpx; height: 70rpx; line-height: 70rpx; border: 0; border-radius: 35rpx; color: #fff; background: #245c50; font-size: 26rpx; }
.retry::after { border: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
