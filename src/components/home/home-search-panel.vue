<script setup lang="ts">
const emit = defineEmits<{
  search: [keyword?: string]
  privateEntry: [type: 'progress' | 'warranty']
}>()
</script>

<template>
  <view class="search-panel">
    <button class="search-box" @click="emit('search')">
      <text class="search-icon">⌕</text>
      <text>搜索小区、封窗知识、施工进度</text>
    </button>
    <view class="shortcuts">
      <button class="shortcut-button" @click="emit('search', '小区')"><text class="shortcut-icon"><text class="shortcut-glyph">⌂</text></text><text class="shortcut-label">查小区</text></button>
      <button class="shortcut-button" @click="emit('search', '封窗知识')"><text class="shortcut-icon"><text class="shortcut-glyph">▤</text></text><text class="shortcut-label">封窗知识</text></button>
      <button class="shortcut-button" @click="emit('privateEntry', 'progress')"><text class="shortcut-icon"><text class="shortcut-glyph">◷</text></text><text class="shortcut-label">我的进度</text></button>
      <button class="shortcut-button" @click="emit('privateEntry', 'warranty')"><text class="shortcut-icon"><text class="shortcut-glyph shortcut-glyph--check">✓</text></text><text class="shortcut-label">我的质保</text></button>
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
.shortcut-button::after {
  border: 0;
}

.search-icon {
  color: var(--home-gold);
  font-size: 36rpx;
}

.shortcuts {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 12rpx;
  margin-top: 20rpx;
}

.shortcut-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  min-width: 88rpx;
  min-height: 132rpx;
  margin: 0;
  padding: 10rpx 0;
  box-sizing: border-box;
  border: 0;
  border-radius: 16rpx;
  color: var(--home-green);
  background: #f5f8f6;
  font-size: 21rpx;
  line-height: normal;
}

.shortcut-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  color: var(--home-gold);
  background: #f7ecdc;
  font-size: 30rpx;
  line-height: 1;
}

.shortcut-glyph {
  line-height: 1;
}

.shortcut-glyph--check {
  transform: translateY(4rpx);
}

.shortcut-label {
  line-height: 28rpx;
}
</style>
