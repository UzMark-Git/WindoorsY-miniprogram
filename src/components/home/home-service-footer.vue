<script setup lang="ts">
import type { StoreSummary, WarrantySummary } from '../../types/domain'

const props = defineProps<{ store: StoreSummary; warranty?: WarrantySummary }>()
const emit = defineEmits<{ warranty: []; store: [] }>()
</script>

<template>
  <view class="service-footer">
    <button class="warranty-card" @click="emit('warranty')">
      <text class="warranty-kicker">10-YEAR WARRANTY</text>
      <text class="warranty-title">安装完成，不是服务结束</text>
      <text class="warranty-copy">独立质保凭证、服务范围与处理记录随时可查。</text>
      <text class="warranty-link">了解十年质保 ›</text>
    </button>
    <button class="store-strip" @click="emit('store')">
      <view class="store-copy">
        <text class="store-name">{{ props.store.name }}实体门店</text>
        <text class="store-hours">营业时间 09:00–18:00</text>
      </view>
      <text class="store-link">门店信息 ›</text>
    </button>
  </view>
</template>

<style scoped>
.service-footer { display: grid; gap: 20rpx; }
.warranty-card { width: 100%; min-width: 88rpx; min-height: 88rpx; margin: 0; border: 0; text-align: left; line-height: normal; }
.store-strip { width: 100%; min-width: 88rpx; min-height: 88rpx; margin: 0; border: 0; text-align: left; line-height: normal; }
.warranty-card::after, .store-strip::after { border: 0; }
.warranty-card { padding: 34rpx 30rpx; border-radius: var(--home-radius); color: #fff; background: linear-gradient(135deg, #24584c, #1b463b); box-shadow: 0 12rpx 34rpx rgba(20,55,46,.12); }
.warranty-kicker, .warranty-title, .warranty-copy, .warranty-link, .store-name, .store-hours { display: block; }
.warranty-kicker { color: #ddc493; letter-spacing: 3rpx; font-size: 20rpx; font-weight: 600; }
.warranty-title { margin-top: 14rpx; font-size: 34rpx; font-weight: 650; }
.warranty-copy { margin-top: 12rpx; color: rgba(255, 255, 255, .78); font-size: 23rpx; line-height: 1.6; }
.warranty-link { margin-top: 20rpx; color: #f1d9a7; font-size: 24rpx; }
.store-strip { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; padding: 24rpx 28rpx; border-radius: var(--home-radius); color: var(--home-green); background: #f5f8f6; }
.store-copy { min-width: 0; }
.store-name { overflow: hidden; font-size: 28rpx; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; }
.store-hours { margin-top: 10rpx; color: var(--home-muted); font-size: 22rpx; }
.store-link { flex: 0 0 auto; color: var(--home-green); font-size: 24rpx; }
</style>
