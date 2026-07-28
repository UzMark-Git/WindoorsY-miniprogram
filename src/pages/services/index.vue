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
    const result=await listServices({storeId:STORE_ID,page:requestPage,pageSize:PAGE_SIZE,district:districtIndex.value?districts.value[districtIndex.value-1]:undefined,stage:current.stage,warranty_status:current.warrantyStatus})
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
function open(item:ServiceSummary){uni.navigateTo({url:item.service_type==='warranty'?`/pages-sub/services/detail?id=${encodeURIComponent(item._id)}`:constructionDetailUrl(item._id)})}
onMounted(async()=>{try{districts.value=(await getServiceFilters(STORE_ID)).districts}finally{load(true)}})
</script>
<template><view class="page"><DemoModeBadge/><PrimaryPageIntro kicker="PROJECT SERVICE" title="施工与质保服务" lead="从现场施工到竣工质保，项目进度和服务期限清晰可查"/><view class="filters"><picker :range="['全部区域',...districts]" :value="districtIndex" @change="changeDistrict"><view class="filter">{{districtIndex?districts[districtIndex-1]:'全部区域'}}<text>⌄</text></view></picker><picker :range="stageOptions" range-key="label" :value="stageIndex" @change="changeStage"><view class="filter">{{stageOptions[stageIndex].label}}<text>⌄</text></view></picker></view><ContentState v-if="status!=='ready'" :status="status" :message="status==='empty'?'暂无施工或质保项目':message" @retry="load(true)"/><view v-else class="list"><ServiceCard v-for="item in items" :key="item._id" :item="item" @select="open(item)" /><button v-if="hasMore" class="more" :disabled="loadingMore" @click="more">{{loadingMore?'加载中…':'加载更多'}}</button><text v-else class="end">— 已展示全部项目 —</text></view></view></template>
<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.filters{display:flex;gap:18rpx;padding:25rpx 30rpx;position:sticky;top:0;z-index:2;background:rgba(244,246,244,.96)}.filters picker{flex:1}.filter{padding:20rpx 22rpx;border-radius:12rpx;color:#334b45;background:#fff;font-size:25rpx;box-shadow:0 5rpx 20rpx rgba(25,61,52,.05)}.filter text{float:right;color:#9ba7a3}.list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20rpx;padding:0 30rpx}.more{grid-column:1 / -1;border:1rpx solid #b9c8c3;border-radius:36rpx;color:#245c50;background:transparent}.more::after{border:0}.end{grid-column:1 / -1;padding:20rpx;text-align:center;color:#99a5a1;font-size:22rpx}</style>
