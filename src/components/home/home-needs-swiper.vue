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
        <button v-for="item in page" :key="item.title" @click="emit('select', item.keyword)">
          <text>{{ item.title }}</text>
          <text>{{ item.subtitle }} ›</text>
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

.need-grid button {
  min-width: 88rpx;
  min-height: 88rpx;
  height: 120rpx;
  margin: 0;
  padding: 20rpx;
  border: 0;
  border-radius: 18rpx;
  background: #fff;
  text-align: left;
  line-height: normal;
  box-shadow: 0 6rpx 22rpx rgba(25,61,52,.06);
}

.need-grid button::after {
  border: 0;
}

.need-grid text {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.need-grid text:first-child {
  color: #22443a;
  font-size: 27rpx;
  font-weight: 650;
}

.need-grid text:last-child {
  margin-top: 10rpx;
  color: #9a7440;
  font-size: 20rpx;
}
</style>
