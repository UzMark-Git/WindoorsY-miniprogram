<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import { createVideoCoordinator, isVideoMedia } from './media-gallery'

defineProps<{ media: string[] }>()
const emit = defineEmits<{ preview: [src: string] }>()
const coordinator = createVideoCoordinator(id => uni.createVideoContext(id).stop())
function videoId(index: number) { return `gallery-video-${index}` }
function play(index: number) { coordinator.play(videoId(index)) }
function preview(src: string) { emit('preview', src) }
onUnload(coordinator.unload)
onBeforeUnmount(coordinator.unload)
</script>

<template>
  <scroll-view v-if="media.length" scroll-x class="gallery"><view class="row">
    <template v-for="(src,index) in media" :key="src">
      <video v-if="isVideoMedia(src)" :id="videoId(index)" class="asset" :src="src" controls @play="play(index)" />
      <image v-else class="asset" :src="src" mode="aspectFill" @click="preview(src)" />
    </template>
  </view></scroll-view>
</template>

<style scoped>
.gallery{width:100%;white-space:nowrap}.row{display:flex;gap:16rpx}.asset{flex:none;width:420rpx;height:270rpx;border-radius:16rpx;background:#e5e9e7}
</style>
