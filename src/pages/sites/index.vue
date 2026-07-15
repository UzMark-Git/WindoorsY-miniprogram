<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSiteFilters, listSites } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import SiteCard from '../../components/site-card.vue'
import type { SiteStage, SiteSummary } from '../../types/domain'
import { createRequestGate } from '../../utils/request-gate'
import { siteDetailUrl } from '../../utils/site-navigation'

const PAGE_SIZE = 10
const STORE_ID = 'store_windoors_demo'
const districts = ref<string[]>([])
const stageLabels: Record<SiteStage, string> = { measuring: '复尺', designing: '设计', installing: '安装', completed: '已交付' }
const stages = ref<Array<{ label: string; value?: SiteStage }>>([{ label: '全部阶段' }])
const districtIndex = ref(0), stageIndex = ref(0), page = ref(1)
const items = ref<SiteSummary[]>([]), hasMore = ref(true)
const status = ref<'loading' | 'ready' | 'empty' | 'error' | 'offline'>('loading'), message = ref('')
const gate = createRequestGate()

async function load(reset = false) {
  const request = reset ? gate.beginReset() : gate.beginMore()
  if (request == null) return
  if (reset) { page.value = 1; items.value = []; hasMore.value = true }
  else page.value += 1
  status.value = 'loading'
  message.value = ''
  try {
    const result = await listSites({ storeId: STORE_ID, page: page.value, pageSize: PAGE_SIZE, district: districtIndex.value ? districts.value[districtIndex.value - 1] : undefined, stage: stages.value[stageIndex.value].value })
    if (!gate.isCurrent(request)) return
    items.value = reset ? result.items : [...items.value, ...result.items]
    hasMore.value = result.items.length === PAGE_SIZE
    status.value = items.value.length ? 'ready' : 'empty'
  } catch (error) {
    if (!gate.isCurrent(request)) return
    const text = error instanceof Error ? error.message : String(error)
    status.value = /network|offline|网络/i.test(text) ? 'offline' : 'error'
    message.value = status.value === 'offline' ? '网络已断开，请检查后重试' : '工地列表加载失败'
  } finally {
    gate.finish(request)
  }
}
function changeDistrict(event: { detail: { value: string } }) { districtIndex.value = Number(event.detail.value); load(true) }
function changeStage(event: { detail: { value: string } }) { stageIndex.value = Number(event.detail.value); load(true) }
function nextPage() { if (hasMore.value) load() }
function selectSite(siteId: string) { uni.navigateTo({ url: siteDetailUrl(siteId) }) }
onMounted(async () => {
  try {
    const filters = await getSiteFilters(STORE_ID)
    districts.value = filters.districts
    stages.value = [{ label: '全部阶段' }, ...filters.stages.map(value => ({ label: stageLabels[value], value }))]
  } finally {
    load(true)
  }
})
</script>

<template>
  <view class="page">
    <view class="intro"><text class="kicker">PROJECT GALLERY</text><text class="title">案例</text><text class="lead">看得见的过程，才是安心的交付</text></view>
    <view class="filters"><picker :range="['全部区域', ...districts]" :value="districtIndex" @change="changeDistrict"><view class="filter">{{ districtIndex ? districts[districtIndex - 1] : '全部区域' }} <text>⌄</text></view></picker><picker :range="stages" range-key="label" :value="stageIndex" @change="changeStage"><view class="filter">{{ stages[stageIndex].label }} <text>⌄</text></view></picker></view>
    <ContentState v-if="status !== 'ready'" :status="status === 'ready' ? 'loading' : status" :message="status === 'empty' ? '暂无符合条件的工地' : message" @retry="load(true)" />
    <view v-else class="list"><SiteCard v-for="site in items" :key="site._id" :site="site" @select="selectSite" /><button v-if="hasMore" class="load-more" @click="nextPage">加载更多</button><text v-else class="end">— 已展示全部工地 —</text></view>
  </view>
</template>

<style scoped>
.page { min-height:100vh; padding-bottom:calc(70rpx + env(safe-area-inset-bottom)); background:#f4f6f4; }.intro { padding:70rpx 32rpx 42rpx; background:#183d34; color:#fff; }.kicker { display:block; color:#d7aa6d; letter-spacing:4rpx; font-size:20rpx; }.title { display:block; margin-top:13rpx; font-size:48rpx; font-weight:650; }.lead { display:block; margin-top:15rpx; color:rgba(255,255,255,.68); font-size:24rpx; }.filters { display:flex; gap:18rpx; padding:25rpx 30rpx; position:sticky; top:0; z-index:2; background:rgba(244,246,244,.96); }.filters picker { flex:1; }.filter { padding:20rpx 22rpx; border-radius:12rpx; color:#334b45; background:#fff; font-size:25rpx; box-shadow:0 5rpx 20rpx rgba(25,61,52,.05); }.filter text { float:right; color:#9ba7a3; }.list { display:flex; flex-direction:column; gap:28rpx; padding:8rpx 30rpx; }.load-more { margin:12rpx 0 0; border:1rpx solid #b9c8c3; border-radius:36rpx; color:#245c50; background:transparent; font-size:25rpx; }.load-more::after { border:0; }.end { padding:20rpx; text-align:center; color:#99a5a1; font-size:22rpx; }
</style>
