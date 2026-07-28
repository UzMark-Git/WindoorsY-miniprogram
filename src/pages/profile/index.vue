<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { listFavorites, type FavoriteCard, type FavoriteType } from '../../api/favorites'
import { listMineAppointments,type MineAppointment } from '../../api/appointments'
import { logoutAccount } from '../../api/account'
import { getHome } from '../../api/content'
import DemoModeBadge from '../../components/demo-mode-badge.vue'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import { isLocalDemoMode } from '../../config/runtime'
import { detailPath, isAuthFailure } from '../../utils/content-sharing'
import { navigateToLegalPage } from '../../utils/legal-navigation'

const tabs:Array<{type:FavoriteType;label:string}>=[{type:'product',label:'产品'},{type:'site',label:'案例'},{type:'staff',label:'人员'}]
const active=ref(0),authenticated=ref(false),loading=ref(false),error=ref(''),items=ref<FavoriteCard[]>([]),appointments=ref<MineAppointment[]>([]),storePhone=ref('')
const statusLabels:Record<string,string>={pending:'待联系',contacted:'已联系',visited:'已到店',won:'已成交',closed:'已关闭'},sourceLabels:Record<string,string>={store:'门店',site:'案例',staff:'人员',product:'产品'}
function login(){
  if (isLocalDemoMode()) {
    uni.showToast({ title: '演示模式不连接账号数据', icon: 'none' })
    return
  }
  uni.navigateTo({url:'/uni_modules/uni-id-pages/pages/login/login?uniIdRedirectUrl='+encodeURIComponent('/pages/profile/index')})
}
function openLegal(url:string){navigateToLegalPage(url,uni)}
async function load(){
  loading.value=true;error.value=''
  if (isLocalDemoMode()) {
    authenticated.value = false
    items.value = []
    appointments.value = []
    error.value = '演示模式不连接账号数据'
    loading.value = false
    return
  }
  try{const [favorites,mine]=await Promise.all([listFavorites(tabs[active.value].type),listMineAppointments()]);authenticated.value=true;items.value=favorites.items;appointments.value=mine.items}
  catch(cause){if(isAuthFailure(cause)){authenticated.value=false;items.value=[];appointments.value=[]}else{error.value=(cause as any)?.errMsg||'个人内容加载失败'}}
  finally{loading.value=false}
}
function select(index:number){active.value=index;load()}
function open(item:FavoriteCard){uni.navigateTo({url:detailPath(item.type,item._id)})}
function openAppointment(id:string){uni.navigateTo({url:`/pages-sub/appointments/detail?id=${encodeURIComponent(id)}`})}
function date(value:number){const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
async function logout(){await logoutAccount()}
function callStore(){if(storePhone.value)uni.makePhoneCall({phoneNumber:storePhone.value})}
onShow(()=>{getHome('store_windoors_demo').then(home=>{storePhone.value=home.store.phone}).catch(()=>{});load()})
</script>

<template><view class="page"><DemoModeBadge/><PrimaryPageIntro kicker="MY WINDOORS" title="我的" lead="管理收藏内容、预约记录与服务入口" />
  <view class="account"><view class="avatar">我</view><view class="account-copy"><text>{{authenticated?'已登录':'登录后管理我的收藏'}}</text><text>{{authenticated?'收藏内容仅对当前账号可见':'收藏可在不同设备间同步'}}</text></view><button v-if="!authenticated" @click="login">微信登录</button></view>
  <view v-if="authenticated" class="appointments"><view class="section-heading"><text>我的预约</text><text>仅显示当前登录账号提交的预约</text></view><view v-if="!appointments.length" class="state">暂无预约记录</view><button v-for="item in appointments" :key="item._id" class="appointment-card" @click="openAppointment(item._id)"><view><text>{{sourceLabels[item.source_type]}}预约</text><text>{{date(item.created_at)}}</text></view><text class="appointment-status">{{statusLabels[item.status]}}</text><text class="arrow">›</text></button></view>
  <view class="favorites"><view class="section-heading"><text>我的收藏</text><text>收藏的产品、案例和服务人员</text></view><view class="tabs"><button v-for="(tab,index) in tabs" :key="tab.type" :class="{active:active===index}" @click="select(index)">{{tab.label}}</button></view>
    <view v-if="!authenticated" class="state"><text>登录后查看云端收藏</text><button @click="login">立即登录</button></view>
    <view v-else-if="loading" class="state">正在加载收藏…</view><view v-else-if="error" class="state error">{{error}}<button @click="load">重新加载</button></view><view v-else-if="!items.length" class="state">暂未收藏{{tabs[active].label}}</view>
    <view v-else class="favorite-list"><button v-for="item in items" :key="`${item.type}-${item._id}`" class="favorite-card" @click="open(item)"><image :src="item.image||'/static/demo/placeholder.png'" mode="aspectFill"/><view><text class="favorite-title">{{item.title}}</text><text class="favorite-summary">{{item.summary||'查看详情'}}</text></view><text class="arrow">›</text></button></view>
  </view>
  <view class="menu"><view :class="{disabled:!storePhone}" @click="callStore"><text>联系客服</text><text>{{storePhone||'暂不可用'}}</text></view><view @click="openLegal('/pages/legal/service-agreement')"><text>用户服务协议</text><text>›</text></view><view @click="openLegal('/pages/legal/privacy-policy')"><text>隐私政策</text><text>›</text></view><view v-if="authenticated" class="logout" @click="logout"><text>退出登录</text><text>›</text></view></view>
</view></template>

<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.account{margin:34rpx 30rpx;padding:32rpx;border-radius:22rpx;background:#fff}.avatar{display:flex;width:88rpx;height:88rpx;border-radius:50%;align-items:center;justify-content:center;color:#a57941;background:#f5eee4;font-size:30rpx}.account-copy{margin:22rpx 0}.account-copy text{display:block}.account-copy text:first-child{color:#203832;font-size:30rpx;font-weight:650}.account-copy text:last-child{margin-top:10rpx;color:#88948f;font-size:22rpx}.account button,.state button{border:0;border-radius:14rpx;color:#fff;background:#1f5a4d;font-size:26rpx}.account button::after,.state button::after,.tabs button::after,.favorite-card::after,.appointment-card::after{border:0}.appointments,.favorites{margin:0 30rpx 24rpx;border-radius:22rpx;overflow:hidden;background:#fff}.section-heading{padding:30rpx 30rpx 20rpx}.section-heading text{display:block}.section-heading text:first-child{color:#203832;font-size:30rpx;font-weight:650}.section-heading text:last-child{margin-top:8rpx;color:#8a9691;font-size:21rpx}.appointment-card{display:flex;align-items:center;gap:18rpx;width:100%;margin:0;padding:22rpx 28rpx;border:0;border-top:1rpx solid #edf0ee;text-align:left;background:#fff}.appointment-card view{flex:1}.appointment-card view text{display:block;color:#294a42;font-size:26rpx}.appointment-card view text:last-child{margin-top:7rpx;color:#89958f;font-size:21rpx}.appointment-status{padding:7rpx 13rpx;border-radius:18rpx;color:#366b91;background:#e4eef6;font-size:20rpx}.tabs{display:flex;padding:0 24rpx;border-bottom:1rpx solid #edf0ee}.tabs button{flex:1;margin:0;padding:0 0 20rpx;border:0;border-radius:0;background:transparent;color:#7b8883;font-size:24rpx}.tabs .active{border-bottom:4rpx solid #a57941;color:#203832;font-weight:650}.state{padding:64rpx 30rpx;text-align:center;color:#87938e;font-size:24rpx}.state text{display:block}.state button{width:220rpx;margin-top:22rpx}.state.error{color:#b5483f}.favorite-card{display:flex;align-items:center;gap:20rpx;width:100%;margin:0;padding:22rpx 28rpx;border:0;border-bottom:1rpx solid #edf0ee;text-align:left;background:#fff}.favorite-card image{width:112rpx;height:88rpx;flex:0 0 112rpx;border-radius:12rpx}.favorite-card view{min-width:0;flex:1}.favorite-title,.favorite-summary{display:block}.favorite-title{color:#294a42;font-size:27rpx;font-weight:650}.favorite-summary{margin-top:9rpx;overflow:hidden;color:#89958f;font-size:21rpx;white-space:nowrap;text-overflow:ellipsis}.arrow{color:#a2aca8;font-size:34rpx}.menu{margin:0 30rpx;border-radius:22rpx;overflow:hidden;background:#fff}.menu view{display:flex;justify-content:space-between;padding:30rpx 32rpx;border-bottom:1rpx solid #edf0ee;color:#314a43;font-size:26rpx}.menu view:last-child{border-bottom:0}.menu view text:last-child{color:#a2aca8}.menu .logout{color:#b5483f}</style>
