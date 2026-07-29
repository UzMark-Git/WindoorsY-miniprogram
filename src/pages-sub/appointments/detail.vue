<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMineAppointment, type MineAppointmentDetail } from '../../api/appointments'
import ContentState from '../../components/content-state.vue'
import { getDemoPageBlock } from '../../config/demo-isolation'
import { isAuthFailure, loginUrl } from '../../utils/content-sharing'

const item = ref<MineAppointmentDetail>()
const status = ref<'loading' | 'ready' | 'empty' | 'error'>('loading')
const message = ref('')
const labels: Record<string, string> = { pending: '待联系', contacted: '已联系', visited: '已到店', won: '已成交', closed: '已关闭' }
const sources: Record<string, string> = { store: '门店', site: '案例', staff: '人员', product: '产品' }

function date(value: number) {
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function load(id: string) {
  const demoBlock = getDemoPageBlock('预约详情')
  if (demoBlock) {
    status.value = 'empty'
    message.value = demoBlock
    return
  }
  try {
    item.value = await getMineAppointment(id)
    status.value = 'ready'
  } catch (error) {
    if (isAuthFailure(error)) {
      uni.navigateTo({ url: loginUrl(`/pages-sub/appointments/detail?id=${encodeURIComponent(id)}`) })
      return
    }
    status.value = 'empty'
    message.value = (error as { errMsg?: string })?.errMsg || '预约不存在或无权查看'
  }
}

onLoad(query => load(String(query?.id || '')))
</script>
<template><view class="page"><ContentState v-if="status!=='ready'" :status="status" :message="message"/><view v-else-if="item" class="panel"><view class="head"><text>{{sources[item.source_type]}}预约</text><text>{{labels[item.status]}}</text></view><view class="row"><text>提交时间</text><text>{{date(item.created_at)}}</text></view><view class="row"><text>联系人</text><text>{{item.name}}</text></view><view class="row"><text>手机号</text><text>{{item.phone}}</text></view><view class="row"><text>所在城市</text><text>{{item.city}}</text></view><view class="need"><text>咨询需求</text><text>{{item.note}}</text></view><view v-if="item.status_history?.length" class="history"><text class="title">跟进记录</text><view v-for="(entry,index) in item.status_history" :key="index"><text>{{labels[entry.to]}}</text><text>{{date(entry.at)}} {{entry.note}}</text></view></view></view></view></template>
<style scoped>.page{min-height:100vh;padding:30rpx;background:#f2f5f3}.panel{padding:30rpx;border-radius:22rpx;background:#fff}.head{display:flex;justify-content:space-between;margin-bottom:24rpx;color:#183b32;font-size:32rpx;font-weight:650}.head text:last-child{color:#366b91;font-size:23rpx}.row{display:flex;justify-content:space-between;padding:18rpx 0;border-bottom:1rpx solid #edf0ef;color:#75837f;font-size:24rpx}.row text:last-child{color:#294a42}.need{padding:24rpx 0}.need text{display:block}.need text:first-child,.title{color:#294a42;font-weight:650}.need text:last-child{margin-top:12rpx;color:#687873;line-height:1.7}.history{padding-top:20rpx;border-top:1rpx solid #edf0ef}.history view{padding:15rpx 0}.history view text{display:block;color:#31574d;font-size:23rpx}.history view text:last-child{margin-top:6rpx;color:#89958f;font-size:21rpx}</style>
