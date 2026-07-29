<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getServiceFilters, listServices } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import DemoModeBadge from '../../components/demo-mode-badge.vue'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import ServiceCard from '../../components/service-card.vue'
import type { ServiceSummary, SiteStage, WarrantyStatus } from '../../types/domain'
import { constructionDetailUrl } from '../../utils/site-navigation'
import { createRequestGate } from '../../utils/request-gate'
import { hasMoreListPages, mergeListPage, PRIMARY_LIST_PAGE_SIZE } from '../../utils/list-pagination'
const STORE_ID='store_windoors_demo'
const PAGE_SIZE=PRIMARY_LIST_PAGE_SIZE
type ServiceStatusFilter = { label:string; stage?:SiteStage; warrantyStatus?:WarrantyStatus }
const stageOptions:Array<ServiceStatusFilter>=[{label:'全部状态'},{label:'测量中',stage:'measuring'},{label:'设计中',stage:'designing'},{label:'安装中',stage:'installing'},{label:'已完工',stage:'completed'},{label:'质保中',warrantyStatus:'active'},{label:'已出保',warrantyStatus:'expired'}]
const districts=ref<string[]>([]),districtIndex=ref(0),stageIndex=ref(0)
const keyword=ref(''),appliedKeyword=ref('')
const items=ref<ServiceSummary[]>([]),page=ref(1),hasMore=ref(true),loadingMore=ref(false),status=ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'),message=ref('')
const gate=createRequestGate()
async function load(reset=false){
  const request=reset?gate.beginReset():gate.beginMore()
  if(request==null)return
  const requestPage=reset?1:page.value+1
  if(reset)status.value='loading'
  else loadingMore.value=true
  message.value=''
  try{
    const current=stageOptions[stageIndex.value]
    const result=await listServices({
      storeId:STORE_ID,
      page:requestPage,
      pageSize:PAGE_SIZE,
      district:districtIndex.value?districts.value[districtIndex.value-1]:undefined,
      stage:current.stage,
      warranty_status:current.warrantyStatus,
      keyword: appliedKeyword.value,
    })
    if(!gate.isCurrent(request))return
    const filteredItems=current.warrantyStatus?result.items.filter(item=>item.service_type==='warranty'&&item.warranty_status===current.warrantyStatus):result.items
    page.value=requestPage
    items.value=mergeListPage(items.value,filteredItems,reset)
    hasMore.value=hasMoreListPages(result.items.length,PAGE_SIZE)
    status.value=items.value.length?'ready':'empty'
  }catch(e){
    if(!gate.isCurrent(request))return
    const text=String((e as any)?.message||e)
    if(reset){status.value=/network|offline|网络/i.test(text)?'offline':'error';message.value=status.value==='offline'?'网络已断开，请检查后重试':'服务列表加载失败'}
    else uni.showToast({title:'加载更多失败，请重试',icon:'none'})
  }finally{
    loadingMore.value=false
    gate.finish(request)
  }
}
function more(){if(hasMore.value)load()}
function changeDistrict(event:{detail:{value:string}}){districtIndex.value=Number(event.detail.value);load(true)}
function changeStage(event:{detail:{value:string}}){stageIndex.value=Number(event.detail.value);load(true)}
function submitSearch(){appliedKeyword.value=keyword.value.trim();load(true)}
function clearSearch(){keyword.value='';appliedKeyword.value='';load(true)}
function open(item:ServiceSummary){uni.navigateTo({url:item.service_type==='warranty'?`/pages-sub/services/detail?id=${encodeURIComponent(item._id)}`:constructionDetailUrl(item._id)})}
onMounted(async()=>{try{districts.value=(await getServiceFilters(STORE_ID)).districts}finally{load(true)}})
</script>
<template>
  <view class="page">
    <DemoModeBadge/>
    <PrimaryPageIntro kicker="PROJECT SERVICE" title="施工与质保服务" lead="从现场施工到竣工质保，项目进度和服务期限清晰可查"/>
    <view class="search-filter-card">
      <view class="search-row">
        <text class="search-icon">⌕</text>
        <input v-model="keyword" confirm-type="search" placeholder="搜索小区、施工项目、质保编号" @confirm="submitSearch"/>
        <text v-if="keyword" class="clear-search" @click="clearSearch">清除</text>
      </view>
      <view class="filters">
        <picker :range="['全部区域',...districts]" :value="districtIndex" @change="changeDistrict"><view class="filter">{{districtIndex?districts[districtIndex-1]:'全部区域'}}<text>⌄</text></view></picker>
        <picker :range="stageOptions" range-key="label" :value="stageIndex" @change="changeStage"><view class="filter">{{stageOptions[stageIndex].label}}<text>⌄</text></view></picker>
      </view>
    </view>
    <ContentState v-if="status!=='ready'" :status="status" :message="status==='empty'?'暂无施工或质保项目':message" @retry="load(true)"/>
    <button v-if="status==='empty'&&appliedKeyword" class="clear-conditions" @click="clearSearch">清除搜索条件</button>
    <view v-if="status==='ready'" class="list"><ServiceCard v-for="item in items" :key="item._id" :item="item" @select="open(item)" /><button v-if="hasMore" class="more" :disabled="loadingMore" @click="more">{{loadingMore?'加载中…':'加载更多'}}</button><text v-else class="end">— 已展示全部项目 —</text></view>
  </view>
</template>
<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.search-filter-card{position:sticky;top:0;z-index:2;margin:22rpx 30rpx;padding:18rpx;border-radius:24rpx;background:#fff;box-shadow:0 10rpx 28rpx rgba(25,61,52,.08)}.search-row{display:flex;align-items:center;min-height:88rpx;padding:0 20rpx;border-radius:18rpx;background:#f5f8f6}.search-icon{margin-right:14rpx;color:#b67b2c;font-size:34rpx}.search-row input{flex:1;color:#193c33;font-size:26rpx}.clear-search{display:flex;align-items:center;min-height:88rpx;padding-left:20rpx;color:#256153;font-size:24rpx}.filters{display:flex;gap:14rpx;margin-top:14rpx}.filters picker{flex:1;min-width:0}.filter{padding:18rpx 20rpx;border-radius:14rpx;color:#334b45;background:#f5f8f6;font-size:24rpx}.filter text{float:right;color:#9ba7a3}.clear-conditions{width:300rpx;min-height:88rpx;margin:10rpx auto 24rpx;border:0;border-radius:44rpx;color:#fff;background:#256153;font-size:25rpx;line-height:88rpx}.clear-conditions::after{border:0}.list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20rpx;padding:0 30rpx}.more{grid-column:1 / -1;border:1rpx solid #b9c8c3;border-radius:36rpx;color:#245c50;background:transparent}.more::after{border:0}.end{grid-column:1 / -1;padding:20rpx;text-align:center;color:#99a5a1;font-size:22rpx}</style>
