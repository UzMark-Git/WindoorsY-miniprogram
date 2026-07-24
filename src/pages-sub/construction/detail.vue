<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { getSiteDetail, getStaffProfile } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import DetailActionBar from '../../components/detail-action-bar.vue'
import MediaGallery from '../../components/media-gallery.vue'
import SiteProgress from '../../components/site-progress.vue'
import type { SiteDetail, SiteStage, StaffProfile } from '../../types/domain'
import { classifyDetailError } from '../../utils/detail-state'
import { shareMessage, timelineMessage } from '../../utils/content-sharing'
import { getSiteUpdateEditorOptions } from '../../api/site-update-editor'

const stageOrder: SiteStage[] = ['measuring', 'designing', 'installing', 'completed']
const stageLabels = ['测量复尺', '方案设计', '安装施工', '竣工验收']
const stageNames: Record<SiteStage, string> = { measuring: '测量复尺', designing: '方案设计', installing: '安装施工', completed: '竣工验收' }
const placeholder = '/static/demo/placeholder.png'
const siteId = ref(''), site = ref<SiteDetail>(), staff = ref<StaffProfile[]>([]), canManageUpdates = ref(false)
const status = ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'), message = ref('')

async function load() {
  if (!siteId.value) { status.value = 'empty'; message.value = '该施工内容已失效'; return }
  status.value = 'loading'
  try {
    site.value = await getSiteDetail(siteId.value)
    getSiteUpdateEditorOptions().then(()=>{canManageUpdates.value=true}).catch(()=>{canManageUpdates.value=false})
    const staffIds = [...new Set([...site.value.staff_ids, ...site.value.updates.flatMap(item => item.staff_ids || [])])]
    const results = await Promise.allSettled(staffIds.map(getStaffProfile))
    staff.value = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : [])
    status.value = 'ready'
  } catch (error) {
    const failure = classifyDetailError(error)
    status.value = failure.status
    message.value = failure.retryable ? (failure.status === 'offline' ? '网络已断开，请检查后重试' : '施工详情加载失败') : '该施工内容已下架或不存在'
  }
}
function openStaff(id: string) { uni.navigateTo({ url: `/pages-sub/staff/detail?id=${encodeURIComponent(id)}` }) }
function appoint() { if (site.value) uni.navigateTo({ url: `/pages-sub/appointments/create?source_type=site&source_id=${encodeURIComponent(site.value._id)}&store_id=${encodeURIComponent(site.value.store_id)}` }) }
function preview(src: string) { if (site.value) uni.previewImage({ current: src, urls: site.value.updates.flatMap(item => item.media).filter(Boolean) }) }
function createUpdate(){uni.navigateTo({url:`/pages-sub/sites/update-create?site_id=${encodeURIComponent(siteId.value)}`})}
function updateDate(value?: number) { const date = new Date(value || Date.now()); return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` }
function updateStaff(ids: string[] = []) { return ids.map(id => staff.value.find(person => person._id === id)?.name).filter(Boolean).join('、') }
onLoad((query: Record<string,string|undefined>) => { siteId.value = query.id || ''; load() })
onShareAppMessage(() => site.value ? shareMessage('site', site.value._id, `门窗施工：${site.value.title}`, site.value.cover_image) : {})
onShareTimeline(() => site.value ? timelineMessage(`门窗施工：${site.value.title}`, site.value.cover_image) : {})
</script>

<template><view class="page">
  <ContentState v-if="status !== 'ready'" :status="status === 'empty' ? 'empty' : status" :message="message" @retry="load" />
  <template v-else-if="site">
    <swiper class="hero" indicator-dots><swiper-item><image :src="site.cover_image || placeholder" mode="aspectFill" :aria-label="`${site.title}封面`" /></swiper-item><swiper-item v-for="update in site.updates" :key="update._id"><image :src="update.media[0] || placeholder" mode="aspectFill" :aria-label="`${update.title}施工图片`" /></swiper-item></swiper>
    <view class="panel headline"><text class="kicker">PROJECT DETAIL</text><text class="title">{{ site.title }}</text><text class="summary">{{ site.summary }}</text><view class="facts"><text>{{ site.district }}</text><text>{{ site.area }}㎡</text><text>{{ site.store_name }}</text></view></view>
    <view class="panel"><text class="section-title">施工进度</text><SiteProgress :stages="stageLabels" :current="stageOrder.indexOf(site.stage)" /></view>
    <button v-if="canManageUpdates" class="record-button" @click="createUpdate">＋ 记录施工动态</button>
    <view class="panel"><text class="section-title">施工动态</text><view class="timeline"><view v-for="update in site.updates" :key="update._id" :class="['update', update.stage==='completed'?'completed':'']"><view class="timeline-dot"/><view class="update-card"><view class="update-meta"><text>{{ updateDate(update.occurred_at || update.created_at) }}</text><text class="stage-badge">{{ update.stage ? stageNames[update.stage] : '施工记录' }}</text></view><text class="update-title">{{ update.title }}</text><text class="copy">{{ update.content }}</text><view v-if="update.quality_tags?.length" class="quality-tags"><text v-for="tag in update.quality_tags" :key="tag">✓ {{ tag }}</text></view><view v-if="update.next_step" class="next-step"><text>下一步</text><text>{{ update.next_step }}</text></view><text v-if="updateStaff(update.staff_ids)" class="update-staff">现场人员：{{ updateStaff(update.staff_ids) }}</text><MediaGallery :media="update.media" @preview="preview" /></view></view></view><text v-if="!site.updates.length" class="muted">项目施工后，现场进度将在这里持续更新</text></view>
    <view class="panel"><text class="section-title">服务人员</text><button v-for="person in staff" :key="person._id" class="person-control" :aria-label="`查看${person.name}的人员详情`" @click="openStaff(person._id)"><image :src="person.avatar || placeholder" mode="aspectFill" :aria-label="`${person.name}头像`"/><view><text class="person-name">{{ person.name }}</text><text class="muted">{{ person.role }}</text></view><text class="arrow">›</text></button><text v-if="!staff.length" class="muted">暂无人员信息</text></view>
  </template>
  <DetailActionBar v-if="status==='ready'&&site" type="site" :content-id="site._id" :title="site.title" :image="site.cover_image" :return-url="`/pages-sub/construction/detail?id=${encodeURIComponent(site._id)}`" @appoint="appoint"/>
</view></template>

<style scoped>
.page{min-height:100vh;padding-bottom:150rpx;background:#f1f4f2}.hero,.hero image{width:100%;height:500rpx}.panel{margin:22rpx 26rpx;padding:30rpx;border-radius:20rpx;background:#fff}.headline{margin-top:-38rpx;position:relative}.kicker{display:block;color:#a4773f;font-size:19rpx;letter-spacing:3rpx}.title{display:block;margin-top:12rpx;color:#183b32;font-size:40rpx;font-weight:650}.summary,.copy{display:block;margin-top:16rpx;color:#687873;font-size:25rpx;line-height:1.7}.facts{display:flex;gap:28rpx;margin-top:22rpx;color:#31574d;font-size:23rpx}.section-title{display:block;margin-bottom:24rpx;color:#193c33;font-size:31rpx;font-weight:650}.timeline{position:relative}.update{position:relative;padding:0 0 28rpx 34rpx;border-left:2rpx solid #dbe6e1}.update:last-child{padding-bottom:0}.timeline-dot{position:absolute;left:-9rpx;top:7rpx;width:16rpx;height:16rpx;border:3rpx solid #fff;border-radius:50%;background:#b98646;box-shadow:0 0 0 2rpx #e8d9c5}.update-card{padding:20rpx;border-radius:16rpx;background:#f7faf8}.completed .update-card{background:#edf7f1}.completed .timeline-dot{background:#267159}.update-meta{display:flex;justify-content:space-between;color:#87958f;font-size:21rpx}.stage-badge{padding:5rpx 12rpx;border-radius:18rpx;color:#21604f;background:#e2f0ea}.update-title,.person-name{display:block;margin-top:12rpx;color:#294a42;font-size:27rpx;font-weight:600}.quality-tags{display:flex;flex-wrap:wrap;gap:10rpx;margin-top:18rpx}.quality-tags text{padding:7rpx 12rpx;border-radius:16rpx;color:#2a6655;background:#e5f1ec;font-size:21rpx}.next-step{display:flex;gap:16rpx;margin-top:18rpx;padding:14rpx;border-radius:10rpx;background:#fff;color:#5f716a;font-size:22rpx}.next-step text:first-child{color:#a4773f;font-weight:600}.update-staff{display:block;margin:16rpx 0;color:#64766f;font-size:22rpx}.person-control{display:flex;align-items:center;gap:20rpx;width:100%;margin:0;padding:18rpx 0;border:0;text-align:left;background:transparent}.person-control::after{border:0}.person-control image{width:82rpx;height:82rpx;border-radius:50%}.person-control view{flex:1}.muted{color:#8c9995;font-size:23rpx}.arrow{font-size:36rpx;color:#98a4a0}.footer{position:fixed;left:0;right:0;bottom:0;z-index:5;display:flex;gap:18rpx;padding:18rpx 26rpx calc(18rpx + env(safe-area-inset-bottom));background:#fff}.footer button{flex:1;border:0;border-radius:40rpx;font-size:27rpx}.footer button::after{border:0}.secondary{color:#24564a;background:#edf3f1}.primary{color:#fff;background:#24564a}
.record-button{margin:22rpx 26rpx;border:0;border-radius:38rpx;color:#fff;background:#1f5a4d;font-size:26rpx}.record-button::after{border:0}
</style>
