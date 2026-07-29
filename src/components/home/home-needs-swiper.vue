<script setup lang="ts">
const needPages = [
  [
    { title: '临街噪音', subtitle: '重点隔音', keyword: '隔音封窗' },
    { title: '阳台封窗', subtitle: '安全采光', keyword: '阳台封窗' },
    { title: '冬冷夏热', subtitle: '保温隔热', keyword: '保温隔热' },
    { title: '厨卫闷热', subtitle: '通风防雨', keyword: '通风防雨' },
  ],
  [
    { title: '儿童安全', subtitle: '防护防坠', keyword: '儿童安全' },
    { title: '高层风压', subtitle: '结构稳定', keyword: '高层封窗' },
    { title: '梅雨潮湿', subtitle: '密封防水', keyword: '密封防水' },
    { title: '日晒西晒', subtitle: '遮阳隔热', keyword: '遮阳隔热' },
  ],
  [
    { title: '旧窗改造', subtitle: '拆换更新', keyword: '旧窗改造' },
    { title: '大景观窗', subtitle: '视野采光', keyword: '景观窗' },
    { title: '推拉通风', subtitle: '开启顺畅', keyword: '推拉窗' },
    { title: '纱窗防蚊', subtitle: '通风防虫', keyword: '纱窗' },
  ],
]

const emit = defineEmits<{ select: [keyword: string] }>()
</script>

<template>
  <swiper class="needs-swiper" indicator-dots :autoplay="false" :circular="false">
    <swiper-item v-for="page in needPages" :key="page[0].title">
      <view class="need-grid">
        <button v-for="item in page" :key="item.title" class="need-card" @click="emit('select', item.keyword)">
          <text class="need-title">{{ item.title }}</text>
          <text class="need-subtitle">{{ item.subtitle }} ›</text>
        </button>
      </view>
    </swiper-item>
  </swiper>
</template>

<style scoped>
.needs-swiper {
  height: 326rpx;
}

.need-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 16rpx;
  padding: 0 6rpx 44rpx;
}

.need-card {
  min-width: 88rpx;
  min-height: 88rpx;
  height: 120rpx;
  margin: 0;
  padding: 20rpx;
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
  font-weight: 650;
}

.need-subtitle {
  margin-top: 10rpx;
  color: var(--home-gold);
  font-size: 20rpx;
}
</style>
