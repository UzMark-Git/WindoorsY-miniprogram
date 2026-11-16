<script setup lang="ts">
import { computed, ref } from 'vue'
import { homeProblemPages, type HomeProblemType } from '../../config/home-problems'
import type { HomeChannelVideo } from '../../types/domain'

const props = defineProps<{ items: HomeChannelVideo[]; placeholder: string }>()
const emit = defineEmits<{ video: [item: HomeChannelVideo]; search: [keyword: string] }>()
const needPages = homeProblemPages()
const videosByProblem = computed(() => new Map(props.items.map(item => [item.problem_type, item])))
const failedCovers = ref<Record<string, string>>({})

function videoFor(type: HomeProblemType) {
  return videosByProblem.value.get(type)
}

function coverFor(item: HomeChannelVideo) {
  return failedCovers.value[item._id] === item.cover_image ? props.placeholder : (item.cover_image || props.placeholder)
}

function markCoverFailed(item: HomeChannelVideo) {
  failedCovers.value[item._id] = item.cover_image
}
</script>

<template>
  <swiper class="needs-swiper" indicator-dots :autoplay="false" :circular="false">
    <swiper-item v-for="page in needPages" :key="page[0].type">
      <view class="need-grid">
        <template v-for="problem in page" :key="problem.type">
          <button
            v-if="videoFor(problem.type)"
            class="need-card need-card--video"
            :aria-label="`观看${problem.title}视频：${videoFor(problem.type)!.title}`"
            @click="emit('video', videoFor(problem.type)!)"
          >
            <view class="need-cover-wrap">
              <image
                class="need-cover"
                :src="coverFor(videoFor(problem.type)!)"
                mode="aspectFill"
                :aria-label="`${videoFor(problem.type)!.title}视频封面`"
                @error="markCoverFailed(videoFor(problem.type)!)"
              />
              <text class="need-category">{{ problem.title }}</text>
              <view class="need-play" aria-hidden="true" />
            </view>
            <view class="need-copy">
              <text class="need-video-title">{{ videoFor(problem.type)!.title }}</text>
              <text class="need-subtitle">{{ problem.subtitle }} ›</text>
            </view>
          </button>
          <button
            v-else
            class="need-card need-card--fallback"
            :aria-label="`搜索${problem.keyword}`"
            @click="emit('search', problem.keyword)"
          >
            <text class="need-title">{{ problem.title }}</text>
            <text class="need-subtitle">{{ problem.subtitle }} ›</text>
          </button>
        </template>
      </view>
    </swiper-item>
  </swiper>
</template>

<style scoped>
.needs-swiper {
  height: 696rpx;
}

.need-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 16rpx;
  padding: 0 6rpx 40rpx;
}

.need-card {
  min-width: 88rpx;
  min-height: 88rpx;
  height: 320rpx;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--home-radius);
  background: #e7f1ed;
  text-align: left;
  line-height: normal;
  box-shadow: none;
}

.need-card::after {
  border: 0;
}

.need-card:nth-child(2),
.need-card:nth-child(3) {
  background: #fbf0df;
}

.need-card--fallback {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20rpx;
}

.need-cover-wrap {
  position: relative;
  height: 168rpx;
  overflow: hidden;
  background: #dbe5df;
}

.need-cover {
  display: block;
  width: 100%;
  height: 168rpx;
}

.need-category {
  position: absolute;
  left: 12rpx;
  bottom: 12rpx;
  max-width: 65%;
  padding: 4rpx 12rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: var(--home-green);
  color: #ffffff;
  font-size: 20rpx;
  line-height: 28rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.need-play {
  position: absolute;
  right: 12rpx;
  bottom: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(23, 61, 52, .85);
}

.need-play::after {
  content: '';
  width: 0;
  height: 0;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 16rpx solid #ffffff;
}

.need-copy {
  padding: 16rpx 20rpx;
}

.need-title,
.need-subtitle {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.need-title {
  color: var(--home-green);
  font-size: 27rpx;
  line-height: 38rpx;
  font-weight: 650;
}

.need-video-title {
  display: -webkit-box;
  height: 68rpx;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--home-green);
  font-size: 25rpx;
  font-weight: 650;
  line-height: 34rpx;
  word-break: break-all;
}

.need-subtitle {
  margin-top: 8rpx;
  color: var(--home-gold);
  font-size: 20rpx;
  line-height: 28rpx;
}
</style>
