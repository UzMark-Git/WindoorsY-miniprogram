<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import ContentState from '../../components/content-state.vue'
import { listChannelVideos } from '../../api/content'
import { isLocalDemoMode } from '../../config/runtime'
import { openChannelsVideo, type ChannelsRuntime } from '../../utils/channels-video'
import type { HomeChannelVideo } from '../../types/domain'

declare const wx: Pick<ChannelsRuntime, 'openChannelsActivity'>
const placeholder = '/static/demo/placeholder.png'
const items = ref<HomeChannelVideo[]>([])
const failedCovers = ref<Record<string, boolean>>({})
const columns = computed(() => [0, 1].map(column => items.value.filter((_, index) => index % 2 === column)))
const loading = ref(false)
const failed = ref(false)
const hasMore = ref(true)
let nextPage = 1
let storeId = ''

async function loadMore() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  failed.value = false
  try {
    const result = await listChannelVideos(storeId, nextPage)
    const ids = new Set(items.value.map(video => video._id))
    for (const video of result.items) {
      if (ids.has(video._id)) continue
      ids.add(video._id)
      items.value.push(video)
    }
    hasMore.value = result.hasMore
    nextPage++
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

function openVideo(video: HomeChannelVideo) {
  const runtime: ChannelsRuntime = { demo: isLocalDemoMode(), showToast: options => uni.showToast(options) }
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && typeof wx.openChannelsActivity === 'function') {
    runtime.openChannelsActivity = wx.openChannelsActivity.bind(wx)
  }
  // #endif
  openChannelsVideo(video, runtime)
}

onLoad(options => {
  storeId = typeof options?.storeId === 'string' ? options.storeId.trim() : ''
  if (storeId) void loadMore()
  else hasMore.value = false
})
onReachBottom(() => { if (!failed.value) void loadMore() })
</script>

<template>
  <view class="video-page">
    <ContentState
      v-if="!items.length"
      :status="loading ? 'loading' : failed ? 'error' : 'empty'"
      :message="failed ? '视频加载失败，请重试' : '暂无已发布视频'"
      @retry="loadMore"
    />
    <template v-else>
      <view class="waterfall">
        <view v-for="(column, index) in columns" :key="index" class="video-column">
          <button v-for="video in column" :key="video._id" class="video-card" :aria-label="`观看视频：${video.title}`" @click="openVideo(video)">
            <image
              v-if="video.cover_image && !failedCovers[video._id]"
              class="video-cover"
              :src="video.cover_image"
              mode="widthFix"
              lazy-load
              @error="failedCovers[video._id] = true"
            />
            <image v-else class="video-cover video-cover--fallback" :src="placeholder" mode="aspectFill" />
            <text class="video-title">{{ video.title }}</text>
          </button>
        </view>
      </view>
      <button v-if="hasMore" class="video-more" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中…' : failed ? '加载失败，点击重试' : '加载更多' }}
      </button>
    </template>
  </view>
</template>

<style scoped>
.video-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx 28rpx calc(32rpx + env(safe-area-inset-bottom)); background: #f4f6f4; }
.waterfall { display: flex; align-items: flex-start; gap: 18rpx; }
.video-column { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 18rpx; }
.video-card { display: block; width: 100%; min-height: 88rpx; margin: 0; padding: 0; border-radius: 24rpx; overflow: hidden; background: #fff; text-align: left; line-height: normal; }
.video-card::after, .video-more::after { border: 0; }
.video-cover { display: block; width: 100%; background: #e7f1ed; }
.video-cover--fallback { height: 210rpx; }
.video-title { display: block; padding: 16rpx 18rpx; color: #183d34; font-size: 28rpx; line-height: 1.45; overflow-wrap: anywhere; }
.video-more { margin: 20rpx auto 0; min-height: 88rpx; background: transparent; color: #245c50; font-size: 26rpx; }
</style>
