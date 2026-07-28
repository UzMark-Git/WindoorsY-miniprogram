<script setup lang="ts">
import { homeSuggestionActions, type HomeSuggestionAction } from './home-entry-actions'
const emit = defineEmits<{
  search: [keyword?: string]
  privateEntry: [type: 'progress' | 'warranty']
}>()

function selectSuggestion(action: HomeSuggestionAction) {
  if (action.type === 'private') emit('privateEntry', action.entry)
  else emit('search', action.keyword)
}
</script>

<template>
  <view class="search-panel">
    <button class="search-box" @click="emit('search')">
      <text class="search-icon">⌕</text>
      <text>搜索小区、封窗知识、施工进度</text>
    </button>
    <view class="suggestions">
      <button v-for="suggestion in homeSuggestionActions" :key="suggestion.label" @click="selectSuggestion(suggestion)">{{ suggestion.label }}</button>
    </view>
    <view class="shortcuts">
      <button @click="emit('search', '小区')"><text>⌂</text><text>查小区</text></button>
      <button @click="emit('search', '封窗知识')"><text>▤</text><text>封窗知识</text></button>
      <button @click="emit('privateEntry', 'progress')"><text>◷</text><text>我的进度</text></button>
      <button @click="emit('privateEntry', 'warranty')"><text>✓</text><text>我的质保</text></button>
    </view>
  </view>
</template>

<style scoped>
.search-panel {
  position: relative;
  z-index: 3;
  padding: 22rpx;
  border-radius: var(--home-radius);
  background: var(--home-surface);
  box-shadow: 0 12rpx 38rpx rgba(20,55,46,.12);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 14rpx;
  width: 100%;
  min-height: 88rpx;
  margin: 0;
  padding: 0 20rpx;
  border: 0;
  border-radius: 16rpx;
  color: var(--home-muted);
  background: #f1f5f3;
  text-align: left;
  font-size: 24rpx;
  line-height: normal;
}

.search-box::after,
.suggestions button::after,
.shortcuts button::after {
  border: 0;
}

.search-icon {
  color: var(--home-gold);
  font-size: 36rpx;
}

.suggestions {
  display: flex;
  gap: 12rpx;
  overflow: hidden;
  margin-top: 18rpx;
  white-space: nowrap;
}

.suggestions button {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-width: 88rpx;
  min-height: 88rpx;
  margin: 0;
  padding: 0 20rpx;
  border: 0;
  border-radius: 24rpx;
  color: var(--home-green);
  background: #f7faf8;
  font-size: 20rpx;
  line-height: normal;
}

.shortcuts {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 12rpx;
  margin-top: 24rpx;
}

.shortcuts button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9rpx;
  min-width: 88rpx;
  min-height: 88rpx;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 16rpx;
  color: var(--home-green);
  background: #f5f8f6;
  font-size: 21rpx;
  line-height: normal;
}

.shortcuts button text:first-child {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 12rpx;
  color: var(--home-gold);
  background: #f7ecdc;
  font-size: 24rpx;
}
</style>
