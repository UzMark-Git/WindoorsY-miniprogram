<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSiteDetail, getStaffProfile } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import MediaGallery from '../../components/media-gallery.vue'
import SiteProgress from '../../components/site-progress.vue'
import type { SiteDetail, SiteStage, StaffProfile } from '../../types/domain'
import { classifyDetailError } from '../../utils/detail-state'

const stageOrder: SiteStage[] = ['measuring', 'designing', 'installing', 'completed']
const stageLabels = ['测量复尺', '方案设计', '安装施工', '竣工验收']
const placeholder = '/static/demo/placeholder.png'
const siteId = ref(''), site = ref<SiteDetail>(), staff = ref<StaffProfile[]>([])
const status = ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'), message = ref('')

async function load() {
  if (!siteId.value) { status.value = 'empty'; message.value = '该工地内容已失效'; return }
  status.value = 'loading'
  try {
    site.value = await getSiteDetail(siteId.value)
    const results = await Promise.allSettled(site.value.staff_ids.map(getStaffProfile))
    staff.value = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : [])
    status.value = 'ready'
  } catch (error) {
    const failure = classifyDetailError(error)
    status.value = failure.status
    message.value = failure.retryable ? (failure.status === 'offline' ? '网络已断开，请检查后重试' : '工地详情加载失败') : '该工地内容已下架或不存在'
  }
}
function openStaff(id: string) { uni.navigateTo({ url: `/pages-sub/staff/detail?id=${encodeURIComponent(id)}` }) }
function appoint() { if (site.value) uni.navigateTo({ url: `/pages-sub/appointment/index?source_type=site&source_id=${encodeURIComponent(site.value._id)}&store_id=${encodeURIComponent(site.value.store_id)}` }) }
function consult() { uni.showModal({ title: '联系客服', content: '请通过预约留下联系方式，我们会尽快联系您。', showCancel: false }) }
function preview(src: string) { if (site.value) uni.previewImage({ current: src, urls: site.value.updates.flatMap(item => item.media).filter(Boolean) }) }
onLoad((query: Record<string,string|undefined>) => { siteId.value = query.id || ''; load() })
</script>

<template><view class="page">
  <ContentState v-if="status !== 'ready'" :status="status === 'empty' ? 'empty' : status" :message="message" @retry="load" />
  <template v-else-if="site">
    <swiper class="hero" indicator-dots><swiper-item><image :src="site.cover_image || placeholder" mode="aspectFill" /></swiper-item><swiper-item v-for="update in site.updates" :key="update._id"><image :src="update.media[0] || placeholder" mode="aspectFill" /></swiper-item></swiper>
    <view class="panel headline"><text class="kicker">PROJECT DETAIL</text><text class="title">{{ site.title }}</text><text class="summary">{{ site.summary }}</text><view class="facts"><text>{{ site.district }}</text><text>{{ site.area }}㎡</text><text>{{ site.store_name }}</text></view></view>
    <view class="panel"><text class="section-title">施工进度</text><SiteProgress :stages="stageLabels" :current="stageOrder.indexOf(site.stage)" /></view>
    <view class="panel"><text class="section-title">施工动态</text><view v-for="update in site.updates" :key="update._id" class="update"><text class="update-title">{{ update.title }}</text><text class="copy">{{ update.content }}</text><MediaGallery :media="update.media" @preview="preview" /></view><text v-if="!site.updates.length" class="muted">暂无施工动态</text></view>
    <view class="panel"><text class="section-title">服务人员</text><view v-for="person in staff" :key="person._id" class="person" @click="openStaff(person._id)"><image :src="person.avatar || placeholder" mode="aspectFill"/><view><text class="person-name">{{ person.name }}</text><text class="muted">{{ person.role }}</text></view><text class="arrow">›</text></view><text v-if="!staff.length" class="muted">暂无人员信息</text></view>
  </template>
  <view v-if="status === 'ready'" class="footer"><button class="secondary" @click="consult">联系客服</button><button class="primary" @click="appoint">立即预约</button></view>
</view></template>

<style scoped>
.page{min-height:100vh;padding-bottom:150rpx;background:#f1f4f2}.hero,.hero image{width:100%;height:500rpx}.panel{margin:22rpx 26rpx;padding:30rpx;border-radius:20rpx;background:#fff}.headline{margin-top:-38rpx;position:relative}.kicker{display:block;color:#a4773f;font-size:19rpx;letter-spacing:3rpx}.title{display:block;margin-top:12rpx;color:#183b32;font-size:40rpx;font-weight:650}.summary,.copy{display:block;margin-top:16rpx;color:#687873;font-size:25rpx;line-height:1.7}.facts{display:flex;gap:28rpx;margin-top:22rpx;color:#31574d;font-size:23rpx}.section-title{display:block;margin-bottom:24rpx;color:#193c33;font-size:31rpx;font-weight:650}.update{padding:22rpx 0;border-top:1rpx solid #edf0ef}.update-title,.person-name{display:block;color:#294a42;font-size:27rpx;font-weight:600}.person{display:flex;align-items:center;gap:20rpx;padding:18rpx 0}.person image{width:82rpx;height:82rpx;border-radius:50%}.person view{flex:1}.muted{color:#8c9995;font-size:23rpx}.arrow{font-size:36rpx;color:#98a4a0}.footer{position:fixed;left:0;right:0;bottom:0;z-index:5;display:flex;gap:18rpx;padding:18rpx 26rpx calc(18rpx + env(safe-area-inset-bottom));background:#fff}.footer button{flex:1;border:0;border-radius:40rpx;font-size:27rpx}.footer button::after{border:0}.secondary{color:#24564a;background:#edf3f1}.primary{color:#fff;background:#24564a}
</style>
