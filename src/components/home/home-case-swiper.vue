<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SiteSummary } from '../../types/domain'

const props = defineProps<{ items: SiteSummary[]; placeholder: string }>()
const emit = defineEmits<{ select: [id: string]; all: [] }>()
const failedImages = ref<Record<string, boolean>>({})

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = []
  for (let index = 0; index < items.length; index += size) pages.push(items.slice(index, index + size))
  return pages
}

const pages = computed(() => chunk(props.items.slice(0, 5), 2))

function imageSource(item: SiteSummary) {
  return failedImages.value[item._id] ? props.placeholder : (item.cover_image || props.placeholder)
}

function caseMeta(item: SiteSummary) {
  const location = item.area ? `${item.area}㎡` : item.district
  return `${item.summary || '查看方案'} · ${location || '本地门窗方案'}`
}
</script>

<template>
  <view class="case-module">
    <view class="module-heading">
      <view><text class="kicker">REAL CASES</text><text class="section-title">真实案例</text></view>
      <button class="all-button" @click="emit('all')">查看全部案例</button>
    </view>
    <swiper class="case-swiper" :indicator-dots="pages.length > 1" :autoplay="false" :circular="false" indicator-color="rgba(25,60,51,.2)" indicator-active-color="#183e34">
      <swiper-item v-for="(page, pageIndex) in pages" :key="pageIndex">
        <view class="case-row">
          <button v-for="item in page" :key="item._id" class="case-card" @click="emit('select', item._id)">
            <image class="case-image" :src="imageSource(item)" mode="aspectFill" @error="failedImages[item._id] = true" />
            <view class="case-copy"><text class="case-title">{{ item.title }}</text><text class="case-meta">{{ caseMeta(item) }}</text></view>
          </button>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style scoped>
.case-module { min-width: 0; }
.module-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 16rpx; margin-bottom: 28rpx; }
.kicker { display: block; color: var(--home-gold); letter-spacing: 4rpx; font-size: 20rpx; font-weight: 600; }
.section-title { display: block; margin-top: 10rpx; color: var(--home-green); font-size: 38rpx; font-weight: 650; }
.all-button { flex: 0 0 auto; min-width: 176rpx; min-height: 88rpx; margin: 0 -18rpx -18rpx 0; padding: 0 18rpx; border: 0; color: var(--home-green); font-size: 24rpx; line-height: 88rpx; text-align: right; background: transparent; }
.all-button::after, .case-card::after { border: 0; }
.case-swiper { height: 432rpx; }
.case-row { display: flex; gap: 18rpx; min-width: 0; padding-bottom: 36rpx; }
.case-card { flex: 1 1 0; min-width: 0; min-height: 384rpx; margin: 0; padding: 0; overflow: hidden; border: 0; border-radius: var(--home-radius); color: inherit; text-align: left; line-height: normal; background: var(--home-surface); }
.case-image { display: block; width: 100%; height: 236rpx; background: #e5ece9; }
.case-copy { padding: 18rpx 18rpx 20rpx; }
.case-title, .case-meta { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.case-title { color: var(--home-green); font-size: 28rpx; font-weight: 650; }
.case-meta { margin-top: 10rpx; color: var(--home-muted); font-size: 21rpx; }
</style>
