<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SiteSummary, SiteStage } from '../types/domain'
import { formatSiteMeta } from './site-card'

const props = defineProps<{ site: SiteSummary; compact?:boolean }>()
defineEmits<{ select: [siteId: string] }>()
const placeholder = '/static/demo/placeholder.png'
const imageSrc = ref(props.site.cover_image || placeholder)
watch(() => props.site.cover_image, value => { imageSrc.value = value || placeholder })
const stageLabel: Record<SiteStage, string> = { measuring: '现场复尺', designing: '方案设计', installing: '安装施工', completed: '已交付' }
</script>

<template>
  <view :class="['card',{'card--compact':compact}]" hover-class="card--pressed" @click="$emit('select', site._id)">
    <image class="cover" :src="imageSrc" mode="aspectFill" @error="imageSrc = placeholder" />
    <view class="body">
      <view class="topline"><text class="stage">{{ stageLabel[site.stage] }}</text><text class="arrow">›</text></view>
      <text class="title">{{ site.title }}</text>
      <text class="summary">{{ site.summary }}</text>
      <view class="meta"><text>{{ site.store_name }}</text><text>{{ formatSiteMeta(site) || site.location }}</text></view>
    </view>
  </view>
</template>

<style scoped>
.card { overflow: hidden; border-radius: 24rpx; background: #fff; box-shadow: 0 12rpx 42rpx rgba(25,61,52,.08); transition: transform .15s; }
.card--pressed { transform: scale(.985); }
.cover { width: 100%; height: 310rpx; display: block; background: #e8efed; }
.body { padding: 26rpx 28rpx 30rpx; }
.topline { display: flex; align-items: center; justify-content: space-between; }
.stage { padding: 8rpx 16rpx; border-radius: 8rpx; color: #245c50; background: #e5f0ed; font-size: 22rpx; font-weight: 600; }
.arrow { color: #9aa7a3; font-size: 44rpx; line-height: 36rpx; }
.title { display: block; margin-top: 17rpx; color: #172d28; font-size: 34rpx; font-weight: 650; }
.summary { display: block; margin-top: 10rpx; color: #66746f; font-size: 25rpx; line-height: 1.55; }
.meta { display: flex; justify-content: space-between; gap: 20rpx; margin-top: 22rpx; padding-top: 20rpx; border-top: 1rpx solid #edf1f0; color: #89938f; font-size: 22rpx; }
</style>
<style scoped>.card--compact{min-width:0;border-radius:16rpx}.card--compact .cover{height:210rpx}.card--compact .body{padding:18rpx}.card--compact .stage{padding:6rpx 10rpx;font-size:18rpx}.card--compact .arrow{font-size:34rpx}.card--compact .title{margin-top:13rpx;overflow:hidden;font-size:27rpx;white-space:nowrap;text-overflow:ellipsis}.card--compact .summary{display:-webkit-box;margin-top:8rpx;overflow:hidden;font-size:20rpx;line-height:1.45;-webkit-box-orient:vertical;-webkit-line-clamp:2}.card--compact .meta{display:block;margin-top:14rpx;padding-top:12rpx;overflow:hidden;font-size:18rpx;white-space:nowrap;text-overflow:ellipsis}.card--compact .meta text{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.card--compact .meta text+text{margin-top:5rpx}</style>
