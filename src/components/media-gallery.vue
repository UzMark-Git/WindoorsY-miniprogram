<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { onUnload } from '@dcloudio/uni-app'
import { createGalleryId, isVideoMedia, pageVideoCoordinator } from './media-gallery'

const emit = defineEmits<{ preview: [src: string] }>()
const galleryId = createGalleryId()
const videoIds = computed(() => props.media.flatMap((src, index) => isVideoMedia(src) ? [videoId(index)] : []))
const props = defineProps<{ media: string[] }>()
function videoId(index: number) { return `${galleryId}-video-${index}` }
function play(index: number) { pageVideoCoordinator.play(videoId(index)) }
function preview(src: string) { emit('preview', src) }
function release() { pageVideoCoordinator.release(videoIds.value) }
onUnload(release)
onBeforeUnmount(release)
</script>

<template>
  <scroll-view v-if="media.length" scroll-x class="gallery"><view class="row">
    <template v-for="(src,index) in media" :key="src">
      <video v-if="isVideoMedia(src)" :id="videoId(index)" class="asset" :src="src" controls :aria-label="`施工动态视频${index + 1}`" @play="play(index)" />
      <button v-else class="image-control" :aria-label="`预览施工动态图片${index + 1}`" @click="preview(src)"><image class="asset" :src="src" mode="aspectFill" :aria-label="`施工动态图片${index + 1}`" /></button>
    </template>
  </view></scroll-view>
</template>

<style scoped>
.gallery{width:100%;white-space:nowrap}.row{display:flex;gap:16rpx}.asset{display:block;flex:none;width:420rpx;height:270rpx;border-radius:16rpx;background:#e5e9e7}.image-control{flex:none;margin:0;padding:0;border:0;background:transparent}.image-control::after{border:0}
</style>
