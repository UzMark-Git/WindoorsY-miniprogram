<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { getStaffProfile } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import DetailActionBar from '../../components/detail-action-bar.vue'
import FloatingWechatService from '../../components/floating-wechat-service.vue'
import ServiceCard from '../../components/service-card.vue'
import type { StaffDetail } from '../../types/domain'
import { classifyDetailError } from '../../utils/detail-state'
import { shareMessage, timelineMessage } from '../../utils/content-sharing'
import { constructionDetailUrl } from '../../utils/site-navigation'
import { showDemoUnavailable } from '../../config/demo-isolation'

const placeholder='/static/demo/placeholder.png'
const staffId=ref(''),profile=ref<StaffDetail>(),avatarSrc=ref(placeholder)
const status=ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'),message=ref('')

async function load(){
  if(!staffId.value){status.value='empty';message.value='该人员内容已失效';return}
  status.value='loading'
  try{profile.value=await getStaffProfile(staffId.value);avatarSrc.value=profile.value.avatar||placeholder;status.value='ready'}
  catch(error){const failure=classifyDetailError(error);status.value=failure.status;message.value=failure.retryable?(failure.status==='offline'?'网络已断开，请检查后重试':'人员详情加载失败'):'该人员内容已下架或不存在'}
}
function appoint(){if(showDemoUnavailable(uni,'预约咨询'))return;if(profile.value)uni.navigateTo({url:`/pages-sub/appointments/create?source_type=staff&source_id=${encodeURIComponent(profile.value._id)}&store_id=${encodeURIComponent(profile.value.store_id)}`})}
function openSite(id:string){const item=profile.value?.related_sites.find(site=>site._id===id);uni.navigateTo({url:item?.service_type==='warranty'?`/pages-sub/services/detail?id=${encodeURIComponent(id)}`:constructionDetailUrl(id)})}
onLoad((query:Record<string,string|undefined>)=>{staffId.value=query.id||'';load()})
onShareAppMessage(()=>profile.value?shareMessage('staff',profile.value._id,`门窗服务顾问：${profile.value.name}`,profile.value.avatar):{})
onShareTimeline(()=>profile.value?timelineMessage(`门窗服务顾问：${profile.value.name}`,profile.value.avatar):{})
</script>

<template>
  <view class="page">
    <ContentState v-if="status!=='ready'" :status="status==='empty'?'empty':status" :message="message" @retry="load"/>
    <template v-else-if="profile">
      <view class="hero">
        <image :src="avatarSrc" mode="aspectFill" :aria-label="`${profile.name}头像`" @error="avatarSrc=placeholder"/>
        <text class="name">{{profile.name}}</text><text class="role">{{profile.role}}</text>
        <text class="bio">{{profile.bio}}</text>
      </view>
      <view class="panel ability">
        <text class="title">专业能力</text>
        <view v-if="profile.specialties.length" class="group"><text class="label">擅长领域</text><view class="tags"><text v-for="item in profile.specialties" :key="item">{{item}}</text></view></view>
        <view v-if="profile.service_regions?.length" class="group"><text class="label">服务区域</text><view class="region-list"><text v-for="region in profile.service_regions" :key="region.code">{{region.city}} · {{region.district}}</text></view></view>
      </view>
      <view class="cases">
        <view class="section-heading"><view><text class="title">近期服务的工地</text><text class="case-count">{{profile.related_sites.length?'展示正在施工中或质保中的相关工地':'相关工地服务记录将在这里展示'}}</text></view></view>
        <scroll-view v-if="profile.related_sites.length" scroll-x class="case-scroll"><view class="case-row"><view v-for="site in profile.related_sites" :key="site._id" class="case-item"><ServiceCard :item="site" compact @select="openSite"/></view></view></scroll-view>
        <view v-else class="empty-cases"><text>暂无公开的近期服务工地</text><text>工地进入施工或质保阶段后会展示在这里</text></view>
      </view>
      <DetailActionBar type="staff" :content-id="profile._id" :title="profile.name" :image="profile.avatar" :return-url="`/pages-sub/staff/detail?id=${encodeURIComponent(profile._id)}`" @appoint="appoint"/>
    </template>
    <FloatingWechatService placement="actionbar" />
  </view>
</template>

<style scoped>
.page{min-height:100vh;padding-bottom:150rpx;background:#f1f4f2}.hero{padding:48rpx 40rpx 44rpx;text-align:center;background:#183e34;color:#fff}.hero image{display:block;width:168rpx;height:168rpx;margin:auto;border:7rpx solid rgba(255,255,255,.18);border-radius:50%;background:#284e44}.name{display:block;margin-top:20rpx;font-size:40rpx;font-weight:650}.role{display:block;margin-top:8rpx;color:#d7aa6d;font-size:24rpx}.bio{display:block;max-width:590rpx;margin:22rpx auto 0;color:rgba(255,255,255,.76);font-size:24rpx;line-height:1.75}.panel,.cases{margin:22rpx 26rpx;padding:30rpx;border-radius:20rpx;background:#fff}.title{display:block;color:#193c33;font-size:31rpx;font-weight:650}.group{margin-top:26rpx}.label{display:block;color:#71807b;font-size:22rpx}.tags,.region-list{display:flex;flex-wrap:wrap;gap:12rpx;margin-top:14rpx}.tags text{padding:10rpx 20rpx;border-radius:26rpx;color:#89612f;background:#faf2e7;font-size:22rpx}.region-list text{padding:10rpx 18rpx;border-radius:10rpx;color:#315f53;background:#edf5f1;font-size:22rpx}.case-count{display:block;margin-top:8rpx;color:#8a9893;font-size:21rpx}.case-scroll{width:100%;margin-top:24rpx;white-space:nowrap}.case-row{display:flex;gap:18rpx;padding-bottom:23rpx}.case-item{flex:0 0 430rpx;white-space:normal}.case-item :deep(.cover){height:250rpx}.case-item :deep(.body){padding:22rpx}.case-item :deep(.title){font-size:29rpx}.case-item :deep(.summary){display:none}.case-item :deep(.meta){flex-direction:column;gap:8rpx}.empty-cases{margin-top:24rpx;padding:38rpx 22rpx;border-radius:14rpx;text-align:center;background:#f5f7f6}.empty-cases text{display:block;color:#788782;font-size:23rpx}.empty-cases text+text{margin-top:9rpx;color:#a0aaa6;font-size:20rpx}
</style>
