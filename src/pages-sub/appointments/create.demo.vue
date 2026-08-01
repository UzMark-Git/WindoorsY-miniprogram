<script setup lang="ts">
import { reactive } from 'vue'
import {
  DEFAULT_APPOINTMENT_REGION,
  formatAppointmentRegion,
} from '../../utils/appointment-region'

const form = reactive({
  name: '',
  phone: '',
  city: formatAppointmentRegion(DEFAULT_APPOINTMENT_REGION),
  need: '',
})

function phoneInput(event: any) {
  const value = String(event?.detail?.value || '').replace(/\D/g, '').slice(0, 11)
  form.phone = value
  return value
}
</script>

<template>
  <view class="page">
    <view class="intro">
      <text class="eyebrow">APPOINTMENT</text>
      <text class="title">预约专属服务</text>
      <text class="copy">留下需求，门店顾问会尽快与你联系，确认方案与报价。</text>
    </view>
    <view class="form">
      <view class="demo-notice">演示模式仅展示预约表单，不会提交或连接云端服务</view>
      <view class="form-field">
        <text class="field-label">姓名</text>
        <input v-model="form.name" class="form-input" type="text" maxlength="20" placeholder="请输入姓名" />
      </view>
      <view class="form-field">
        <text class="field-label">手机号</text>
        <input v-model="form.phone" class="form-input" type="number" maxlength="11" placeholder="请输入手机号" @input="phoneInput" />
      </view>
      <view class="form-field">
        <text class="field-label">所在城市</text>
        <view class="region-picker-field">
          <view class="demo-region">{{form.city}}（演示数据）</view>
        </view>
      </view>
      <view class="form-field">
        <text class="field-label">您的需求</text>
        <textarea v-model="form.need" class="form-textarea" maxlength="300" placeholder="例如：封阳台、门窗换新" />
      </view>
      <button class="submit" disabled>演示模式不可提交</button>
    </view>
  </view>
</template>

<style scoped>
.page{min-height:100vh;padding:40rpx 28rpx;background:#f2f5f3}.intro{padding:34rpx 14rpx}.eyebrow{display:block;color:#a4773f;font-size:20rpx;letter-spacing:4rpx}.title{display:block;margin-top:14rpx;color:#183b32;font-size:42rpx;font-weight:650}.copy{display:block;margin-top:14rpx;color:#74827e;font-size:25rpx}.form{padding:34rpx;border-radius:22rpx;background:#fff}.demo-notice{margin-bottom:28rpx;padding:20rpx 22rpx;border-radius:12rpx;color:#7a633f;background:#f7f0e5;font-size:23rpx;line-height:1.6}.form-field{display:block;margin-bottom:28rpx;color:#294a42;font-size:25rpx}.field-label{display:block}.form-input,.form-textarea{position:relative;z-index:1;box-sizing:border-box;width:100%;margin-top:12rpx;padding:0 22rpx;border-radius:12rpx;background:#f5f7f6;color:#294a42;font-size:27rpx;pointer-events:auto}.form-input{height:88rpx;min-height:88rpx;line-height:88rpx}.form-textarea{height:210rpx;padding-top:22rpx;line-height:1.6}.region-picker-field{margin-top:12rpx}.demo-region{box-sizing:border-box;height:88rpx;padding:0 22rpx;border-radius:12rpx;line-height:88rpx;background:#f5f7f6;color:#687873;font-size:25rpx}.submit{margin-top:12rpx;border:0;border-radius:42rpx;color:#fff;background:#24564a;font-size:28rpx}.submit[disabled]{opacity:.55}.submit::after{border:0}
</style>
