<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ServiceSummary } from '../types/domain'

const props = defineProps<{ item: ServiceSummary; compact?: boolean }>()
defineEmits<{ select: [id: string] }>()
const placeholder = '/static/demo/placeholder.png'
const imageSrc = ref(props.item.cover_image || placeholder)
watch(() => props.item.cover_image, value => { imageSrc.value = value || placeholder })
function date(value?: number) { if (!value) return ''; const d = new Date(value); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
function stageLabel(stage: string) { return ({ measuring: '测量中', designing: '设计中', installing: '安装中', completed: '已完工' } as Record<string, string>)[stage] || '施工' }
</script>

<template>
  <view :class="['service-card', { 'service-card--compact': compact }]" hover-class="pressed" @click="$emit('select', item._id)">
    <image :src="imageSrc" mode="aspectFill" @error="imageSrc = placeholder" />
    <view class="body">
      <view class="top">
        <text :class="['badge', item.service_type]">{{ item.service_type === 'warranty' ? (item.warranty_status === 'active' ? '质保中' : '已过质保') : stageLabel(item.stage) }}</text>
        <text>{{ item.service_type === 'warranty' ? item.warranty_no : '施工' }}</text>
      </view>
      <text class="title">{{ item.title }}</text>
      <text class="meta">{{ item.district }} · {{ item.service_type === 'warranty' ? '验收 ' + date(item.accepted_at) : '项目施工中' }}</text>
      <text v-if="item.service_type === 'warranty'" class="expires">质保至 {{ date(item.warranty_expires_at) }}</text>
    </view>
  </view>
</template>

<style scoped>
.service-card{min-width:0;overflow:hidden;border-radius:16rpx;background:#fff;box-shadow:0 8rpx 24rpx rgba(25,61,52,.08);transition:transform .15s}.pressed{transform:scale(.985)}.service-card image{display:block;width:100%;height:210rpx;background:#e8efed}.body{padding:18rpx}.top{display:flex;align-items:center;justify-content:space-between;gap:8rpx;color:#89958f;font-size:17rpx}.top>text:last-child{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.badge{flex:none;padding:6rpx 10rpx;border-radius:20rpx}.construction{color:#87602e;background:#f8ecd9}.warranty{color:#287354;background:#e2f2e9}.title{display:block;margin-top:13rpx;overflow:hidden;color:#183b32;font-size:27rpx;font-weight:650;white-space:nowrap;text-overflow:ellipsis}.meta,.expires{display:block;margin-top:9rpx;overflow:hidden;color:#74827e;font-size:20rpx;white-space:nowrap;text-overflow:ellipsis}.expires{color:#a57941}
.service-card--compact{border-radius:24rpx}.service-card--compact image{height:310rpx}.service-card--compact .body{padding:26rpx 28rpx 30rpx}.service-card--compact .top{font-size:22rpx}.service-card--compact .badge{padding:8rpx 16rpx;border-radius:8rpx}.service-card--compact .title{margin-top:17rpx;font-size:34rpx}.service-card--compact .meta,.service-card--compact .expires{margin-top:10rpx;font-size:25rpx}
</style>
