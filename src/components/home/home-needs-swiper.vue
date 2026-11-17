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
      <view class="need-page">
        <view class="need-featured">
          <template v-for="(problem, index) in page" :key="problem.type">
            <button
              v-if="index === 0 && videoFor(problem.type)"
              class="need-card need-card--featured need-card--video"
              :aria-label="`观看${problem.title}视频：${videoFor(problem.type)!.title}`"
              @click="emit('video', videoFor(problem.type)!)"
            >
              <image
                class="need-featured-cover"
                :src="coverFor(videoFor(problem.type)!)"
                mode="aspectFill"
                :aria-label="`${videoFor(problem.type)!.title}视频封面`"
                @error="markCoverFailed(videoFor(problem.type)!)"
              />
              <view class="need-play" aria-hidden="true" />
              <view class="need-featured-copy">
                <text class="need-category">{{ problem.title }}</text>
                <text class="need-video-title">{{ videoFor(problem.type)!.title }}</text>
              </view>
            </button>
            <button
              v-else-if="index === 0"
              class="need-card need-card--featured need-card--fallback"
              :aria-label="`搜索${problem.keyword}`"
              @click="emit('search', problem.keyword)"
            >
              <view class="need-featured-copy">
                <text class="need-title">{{ problem.title }}</text>
                <text class="need-subtitle">{{ problem.subtitle }} ›</text>
              </view>
            </button>
          </template>
        </view>
        <view class="need-side-list">
          <template v-for="(problem, index) in page" :key="problem.type">
            <button
              v-if="index > 0 && videoFor(problem.type)"
              class="need-card need-card--compact need-card--video"
              :aria-label="`观看${problem.title}视频：${videoFor(problem.type)!.title}`"
              @click="emit('video', videoFor(problem.type)!)"
            >
              <view class="need-compact-media">
                <image
                  class="need-compact-cover"
                  :src="coverFor(videoFor(problem.type)!)"
                  mode="aspectFill"
                  :aria-label="`${videoFor(problem.type)!.title}视频封面`"
                  @error="markCoverFailed(videoFor(problem.type)!)"
                />
                <view class="need-play need-play--small" aria-hidden="true" />
              </view>
              <view class="need-compact-copy">
                <text class="need-category">{{ problem.title }}</text>
                <text class="need-video-title">{{ videoFor(problem.type)!.title }}</text>
              </view>
            </button>
            <button
              v-else-if="index > 0"
              class="need-card need-card--compact need-card--fallback"
              :aria-label="`搜索${problem.keyword}`"
              @click="emit('search', problem.keyword)"
            >
              <view class="need-compact-placeholder" aria-hidden="true">问</view>
              <view class="need-compact-copy">
                <text class="need-title">{{ problem.title }}</text>
                <text class="need-subtitle">{{ problem.subtitle }} ›</text>
              </view>
            </button>
          </template>
        </view>
      </view>
    </swiper-item>
  </swiper>
</template>

<style scoped>
.needs-swiper {
  height: 572rpx;
}

.need-page {
  display: grid;
  grid-template-columns: minmax(0,46fr) minmax(0,54fr);
  gap: 16rpx;
  height: 520rpx;
  padding: 0 6rpx 40rpx;
}

.need-featured {
  min-width: 0;
  height: 520rpx;
}

.need-side-list {
  display: grid;
  grid-template-rows: repeat(3,minmax(0,1fr));
  gap: 12rpx;
  min-width: 0;
  height: 520rpx;
}

.need-card {
  min-width: 88rpx;
  min-height: 88rpx;
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

.need-side-list .need-card:nth-child(1),
.need-side-list .need-card:nth-child(2) {
  background: #fbf0df;
}

.need-card--featured {
  position: relative;
  width: 100%;
  height: 520rpx;
}

.need-card--compact {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.need-featured-cover {
  display: block;
  width: 100%;
  height: 100%;
  background: #dbe5df;
}

.need-featured-copy {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 80rpx 20rpx 20rpx;
  background: linear-gradient(180deg, rgba(23, 61, 52, 0), rgba(23, 61, 52, .92));
}

.need-card--featured.need-card--fallback {
  display: flex;
  align-items: center;
}

.need-card--fallback .need-featured-copy {
  position: static;
  min-width: 0;
  padding: 20rpx;
  background: transparent;
}

.need-compact-media {
  position: relative;
  flex: 0 0 116rpx;
  width: 116rpx;
  height: 100%;
  overflow: hidden;
  background: #dbe5df;
}

.need-compact-cover {
  display: block;
  width: 100%;
  height: 100%;
}

.need-compact-placeholder {
  display: flex;
  flex: 0 0 116rpx;
  align-items: center;
  justify-content: center;
  width: 116rpx;
  height: 100%;
  background: #dbe5df;
  color: var(--home-green);
  font-size: 36rpx;
}

.need-compact-copy {
  flex: 1;
  align-self: center;
  min-width: 0;
  padding: 14rpx 12rpx;
}

.need-category {
  display: inline-block;
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 8rpx;
  padding: 4rpx 12rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: var(--home-green);
  color: #ffffff;
  font-size: 20rpx;
  line-height: 28rpx;
  vertical-align: top;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.need-play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

.need-play--small {
  width: 40rpx;
  height: 40rpx;
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

.need-featured-copy .need-category,
.need-featured-copy .need-video-title {
  color: #ffffff;
}

.need-subtitle {
  margin-top: 8rpx;
  color: var(--home-gold);
  font-size: 20rpx;
  line-height: 28rpx;
}
</style>
