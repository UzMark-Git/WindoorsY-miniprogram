<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createAppointment, type AppointmentSourceType } from '../../api/appointments'
import { validateAppointment, type AppointmentErrors, type AppointmentFields } from '../../utils/appointment'

const form = reactive<AppointmentFields>({ name: '', phone: '', city: '', need: '' })
const errors = reactive<AppointmentErrors>({})
const source = reactive({ source_type: '' as AppointmentSourceType, source_id: '', store_id: '' })
const submitting = ref(false)
const loginReturnKey = 'appointment-login-return'

function returnUrl() {
  const query = new URLSearchParams(source).toString()
  return `/pages-sub/appointments/create?${query}`
}
function isAuthError(error: unknown) {
  const code = (error as { errCode?: string })?.errCode
  return code === 'AUTH_REQUIRED' || code === 'uni-id-check-token-failed'
}
function login() {
  const url = returnUrl()
  uni.setStorageSync(loginReturnKey, url)
  uni.navigateTo({ url: `/uni_modules/uni-id-pages/pages/login/login?uniIdRedirectUrl=${encodeURIComponent(url)}` })
}
async function submit() {
  if (submitting.value) return
  Object.keys(errors).forEach(key => delete errors[key as keyof AppointmentErrors])
  Object.assign(errors, validateAppointment(form))
  if (Object.keys(errors).length) return
  submitting.value = true
  try {
    const result = await createAppointment({ ...form, ...source })
    uni.removeStorageSync(loginReturnKey)
    uni.redirectTo({ url: `/pages-sub/appointments/result?id=${encodeURIComponent(result.id)}` })
  } catch (error) {
    if (isAuthError(error)) login()
    else uni.showToast({ title: (error as { errMsg?: string })?.errMsg || '提交失败，请稍后重试', icon: 'none' })
  } finally { submitting.value = false }
}
onLoad((query: Record<string, string | undefined>) => {
  source.source_type = (query.source_type || '') as AppointmentSourceType
  source.source_id = query.source_id || ''
  source.store_id = query.store_id || ''
})
</script>

<template><view class="page"><view class="intro"><text class="eyebrow">APPOINTMENT</text><text class="title">预约专属服务</text><text class="copy">留下需求，门店顾问会尽快与您联系。</text></view><view class="form"><label><text>姓名</text><input v-model="form.name" maxlength="20" placeholder="请输入姓名"/><text v-if="errors.name" class="error">{{errors.name}}</text></label><label><text>手机号</text><input v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号"/><text v-if="errors.phone" class="error">{{errors.phone}}</text></label><label><text>所在城市</text><input v-model="form.city" maxlength="40" placeholder="请输入城市"/><text v-if="errors.city" class="error">{{errors.city}}</text></label><label><text>您的需求</text><textarea v-model="form.need" maxlength="300" placeholder="例如：封阳台、门窗换新"/><text v-if="errors.need" class="error">{{errors.need}}</text></label><button class="submit" :disabled="submitting" @click="submit">{{submitting?'提交中…':'提交预约'}}</button></view></view></template>
<style scoped>.page{min-height:100vh;padding:40rpx 28rpx;background:#f2f5f3}.intro{padding:34rpx 14rpx}.eyebrow{display:block;color:#a4773f;font-size:20rpx;letter-spacing:4rpx}.title{display:block;margin-top:14rpx;color:#183b32;font-size:42rpx;font-weight:650}.copy{display:block;margin-top:14rpx;color:#74827e;font-size:25rpx}.form{padding:34rpx;border-radius:22rpx;background:#fff}.form label{display:block;margin-bottom:28rpx;color:#294a42;font-size:25rpx}.form input,.form textarea{box-sizing:border-box;width:100%;margin-top:12rpx;padding:22rpx;border-radius:12rpx;background:#f5f7f6;font-size:27rpx}.form textarea{height:210rpx}.error{display:block;margin-top:8rpx;color:#bd3f32;font-size:22rpx}.submit{margin-top:12rpx;border:0;border-radius:42rpx;color:#fff;background:#24564a;font-size:28rpx}.submit[disabled]{opacity:.55}.submit::after{border:0}</style>
