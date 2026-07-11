<script setup lang="ts">
import { computed } from 'vue'
import { mapProgress } from './site-progress'

const props = defineProps<{ stages: string[]; current: number }>()
const items = computed(() => mapProgress(props.stages, props.current))
</script>

<template>
  <view class="progress">
    <view v-for="(item, index) in items" :key="item.label" class="step" :class="`step--${item.state}`">
      <view class="track"><view class="dot">{{ item.state === 'completed' ? '✓' : index + 1 }}</view><view v-if="index < items.length - 1" class="line" /></view>
      <text>{{ item.label }}</text>
    </view>
  </view>
</template>

<style scoped>
.progress{display:flex;padding:26rpx 0}.step{flex:1;text-align:center;color:#9aa5a1;font-size:22rpx}.track{display:flex;align-items:center;margin-bottom:14rpx}.dot{width:42rpx;height:42rpx;line-height:42rpx;margin-left:calc(50% - 21rpx);border-radius:50%;background:#dfe5e3;color:#fff}.line{flex:1;height:3rpx;background:#dfe5e3}.step--completed .dot,.step--completed .line,.step--active .dot{background:#b47c38}.step--completed text,.step--active text{color:#23463d}.step--active .dot{box-shadow:0 0 0 8rpx rgba(180,124,56,.16)}
</style>
