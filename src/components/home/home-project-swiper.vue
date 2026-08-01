<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ServiceSummary, SiteStage } from '../../types/domain'
import { projectBadge, projectProgress } from './home-project-presentation'

const props = defineProps<{ items: ServiceSummary[]; placeholder: string }>()
const emit = defineEmits<{ select: [item: ServiceSummary]; all: [] }>()
const failedImages = ref<Record<string, boolean>>({})
const projects = computed(() => props.items.slice(0, 5))
const constructionBadge = '正在交付的项目'

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
  return projectProgress(item, stageLabel)
}

function badgeText(item: ServiceSummary) {
  return item.service_type === 'warranty' ? projectBadge(item.service_type, item.warranty_status) : constructionBadge
}

function projectBadgeTone(item: ServiceSummary) {
  if (item.service_type === 'warranty' && item.warranty_status === 'expired') {
    return 'delivery-badge--warranty-expired'
  }
  if (item.service_type === 'warranty') {
    return 'delivery-badge--warranty-active'
  }
  return 'delivery-badge--construction'
}

function projectCardTone(item: ServiceSummary) {
  if (item.service_type === 'warranty' && item.warranty_status === 'expired') {
    return 'project-card--gray'
  }
  const highlighted = item.service_type === 'warranty'
    ? item.warranty_status === 'active'
    : item.stage === 'completed'
  return highlighted ? 'project-card--green' : 'project-card--gold'
}
</script>

<template>
  <view class="project-module">
    <view class="module-heading">
      <view><text class="kicker">RECENT PROJECTS</text><text class="section-title">施工全程可见</text></view>
      <button class="all-button" @click="emit('all')">查看全部进度</button>
    </view>
    <swiper class="project-swiper" :indicator-dots="projects.length > 1" :autoplay="false" :circular="false" indicator-color="rgba(25,60,51,.2)" indicator-active-color="#183e34">
      <swiper-item v-for="item in projects" :key="item._id">
        <view class="project-slide" @click="emit('select', item)">
          <image class="project-image" :src="imageSource(item)" mode="aspectFill" @error="failedImages[item._id] = true" />
          <text :class="['delivery-badge', projectBadgeTone(item)]">{{ badgeText(item) }}</text>
          <button :class="['project-card', projectCardTone(item)]">
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
.project-swiper { height: 462rpx; overflow: hidden; border-radius: 20rpx; }
.project-slide { position: relative; width: 100%; height: 414rpx; overflow: hidden; border-radius: var(--home-radius); background: var(--home-green); }
.project-image { position: absolute; inset: 0; width: 100%; height: 100%; background: #2c5147; }
.delivery-badge { position: absolute; top: 24rpx; right: 24rpx; max-width: 260rpx; padding: 10rpx 16rpx; overflow: hidden; border: 1rpx solid transparent; border-radius: 99rpx; color: #fff8eb; font-size: 21rpx; white-space: nowrap; text-overflow: ellipsis; box-shadow: 0 4rpx 14rpx rgba(10, 31, 25, .22); }
.delivery-badge--construction { border-color: rgba(242, 206, 139, .76); background: rgba(139, 91, 29, .78); }
.delivery-badge--warranty-active { border-color: rgba(174, 214, 197, .76); background: rgba(24, 62, 52, .78); }
.delivery-badge--warranty-expired { border-color: rgba(207, 215, 211, .7); background: rgba(70, 79, 75, .78); }
.project-card { position: absolute; right: 24rpx; bottom: 24rpx; left: 24rpx; min-height: 130rpx; margin: 0; padding: 24rpx; border: 0; border-radius: 16rpx; color: var(--home-green); text-align: left; line-height: normal; }
.project-card--green { background: rgba(231, 241, 237, .82); }
.project-card--gold { background: rgba(251, 240, 223, .82); }
.project-card--gray { background: rgba(232, 235, 233, .82); }
.project-title, .project-progress { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.project-title { font-size: 30rpx; font-weight: 650; }
.project-progress { margin-top: 10rpx; color: var(--home-muted); font-size: 22rpx; }
</style>
