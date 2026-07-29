<script setup lang="ts">
type Placement = 'tabbar' | 'actionbar' | 'plain'
const props = withDefaults(
  defineProps<{ placement?: 'tabbar' | 'actionbar' | 'plain' }>(),
  { placement: 'plain' as Placement },
)

function unavailable() {
  uni.showToast({ title: '请在微信小程序中使用客服', icon: 'none' })
}
</script>

<template>
  <!-- #ifdef MP-WEIXIN -->
  <button
    class="floating-service"
    :class="`floating-service--${props.placement}`"
    open-type="contact"
    aria-label="联系微信客服"
  >
    客服
  </button>
  <!-- #endif -->
  <!-- #ifndef MP-WEIXIN -->
  <button
    class="floating-service"
    :class="`floating-service--${props.placement}`"
    aria-label="联系微信客服"
    @click="unavailable"
  >
    客服
  </button>
  <!-- #endif -->
</template>

<style scoped>
.floating-service {
  position: fixed;
  right: 24rpx;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #17483c;
  background: #f3d9a9;
  box-shadow: 0 10rpx 26rpx rgba(25, 61, 52, .18);
  font-size: 24rpx;
  font-weight: 650;
  line-height: 1;
}
.floating-service::after { border: 0; }
.floating-service--tabbar { bottom: calc(120rpx + env(safe-area-inset-bottom)); }
.floating-service--actionbar { bottom: calc(158rpx + env(safe-area-inset-bottom)); }
.floating-service--plain { bottom: calc(36rpx + env(safe-area-inset-bottom)); }
</style>
