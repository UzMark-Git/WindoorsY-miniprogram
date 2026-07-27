<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ServiceSummary, SiteStage } from '../../types/domain'

const props = defineProps<{ items: ServiceSummary[]; placeholder: string }>()
const emit = defineEmits<{ select: [item: ServiceSummary]; all: [] }>()
const failedImages = ref<Record<string, boolean>>({})
const projects = computed(() => props.items.slice(0, 5))

const stageLabel: Record<SiteStage, string> = {
  measuring: '正在测量',
  designing: '正在设计',
  installing: '正在安装',
  completed: '已完成',
}

function imageSource(item: ServiceSummary) {
  return failedImages.value[item._id] ? props.placeholder : (item.cover_image || props.placeholder)
}

function progressText(item: ServiceSummary) {
  if (item.service_type === 'warranty') return item.warranty_status === 'expired' ? '质保记录已归档' : '十年质保服务中'
  return `${stageLabel[item.stage]}，可查看现场进度`
}
</script>

<template>
  <view class="project-module">
    <view class="module-heading">
      <view><text class="kicker">RECENT PROJECTS</text><text class="section-title">近期施工与质保</text></view>
      <button class="all-button" @click="emit('all')">查看全部</button>
    </view>
    <swiper class="project-swiper" :indicator-dots="projects.length > 1" :autoplay="false" :circular="false" indicator-color="rgba(255,255,255,.38)" indicator-active-color="#fff">
      <swiper-item v-for="item in projects" :key="item._id">
        <view class="project-slide">
          <image class="project-image" :src="imageSource(item)" mode="aspectFill" @error="failedImages[item._id] = true" />
          <view class="project-veil" />
          <text class="delivery-badge">正在交付的项目</text>
          <button class="project-card" @click="emit('select', item)">
            <text class="project-title">{{ item.title }} · {{ stageLabel[item.stage] }}</text>
            <text class="project-progress">{{ progressText(item) }}</text>
          </button>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style scoped>
.project-module { min-width: 0; }
.module-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 16rpx; margin-bottom: 28rpx; }
.kicker { display: block; color: var(--home-gold); letter-spacing: 4rpx; font-size: 20rpx; font-weight: 600; }
.section-title { display: block; margin-top: 10rpx; color: var(--home-green); font-size: 38rpx; font-weight: 650; }
.all-button { flex: 0 0 auto; min-width: 144rpx; min-height: 88rpx; margin: 0 -18rpx -18rpx 0; padding: 0 18rpx; border: 0; color: var(--home-green); font-size: 24rpx; line-height: 88rpx; text-align: right; background: transparent; }
.all-button::after, .project-card::after { border: 0; }
.project-swiper { height: 450rpx; overflow: hidden; border-radius: 20rpx; }
.project-slide { position: relative; width: 100%; height: 414rpx; overflow: hidden; border-radius: var(--home-radius); background: var(--home-green); }
.project-image, .project-veil { position: absolute; inset: 0; width: 100%; height: 100%; }
.project-image { background: #2c5147; }
.project-veil { pointer-events: none; background: linear-gradient(135deg, rgba(12, 49, 40, .92) 0%, rgba(18, 59, 49, .76) 38%, rgba(18, 59, 49, .16) 76%); backdrop-filter: blur(4rpx); }
.delivery-badge { position: absolute; top: 24rpx; right: 24rpx; max-width: 260rpx; padding: 10rpx 16rpx; overflow: hidden; border-radius: 99rpx; color: #f8f3ea; font-size: 21rpx; white-space: nowrap; text-overflow: ellipsis; background: rgba(255, 255, 255, .16); }
.project-card { position: absolute; right: 24rpx; bottom: 24rpx; left: 24rpx; min-height: 130rpx; margin: 0; padding: 24rpx; border: 0; border-radius: 16rpx; color: #fff; text-align: left; line-height: normal; background: rgba(9, 35, 29, .64); }
.project-title, .project-progress { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.project-title { font-size: 30rpx; font-weight: 650; }
.project-progress { margin-top: 10rpx; color: rgba(255, 255, 255, .8); font-size: 22rpx; }
</style>
