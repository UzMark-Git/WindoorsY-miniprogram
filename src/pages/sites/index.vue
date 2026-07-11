<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listSites } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import SiteCard from '../../components/site-card.vue'
import type { SiteStage, SiteSummary } from '../../types/domain'

const PAGE_SIZE = 10
const districts = ['全部区域', '滨江区', '西湖区', '拱墅区']
const stages: Array<{ label: string; value?: SiteStage }> = [{ label: '全部阶段' }, { label: '复尺', value: 'measuring' }, { label: '设计', value: 'designing' }, { label: '安装', value: 'installing' }, { label: '已交付', value: 'completed' }]
const districtIndex = ref(0), stageIndex = ref(0), page = ref(1)
const items = ref<SiteSummary[]>([]), hasMore = ref(true)
const status = ref<'loading' | 'ready' | 'empty' | 'error' | 'offline'>('loading'), message = ref('')

async function load(reset = false) {
  if (reset) { page.value = 1; items.value = []; hasMore.value = true }
  status.value = 'loading'
  try {
    const result = await listSites({ page: page.value, pageSize: PAGE_SIZE, district: districtIndex.value ? districts[districtIndex.value] : undefined, stage: stages[stageIndex.value].value })
    items.value = reset ? result.items : [...items.value, ...result.items]
    hasMore.value = result.items.length === PAGE_SIZE
    status.value = items.value.length ? 'ready' : 'empty'
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error)
    status.value = /network|offline|网络/i.test(text) ? 'offline' : 'error'
    message.value = status.value === 'offline' ? '网络已断开，请检查后重试' : '工地列表加载失败'
  }
}
function changeDistrict(event: { detail: { value: string } }) { districtIndex.value = Number(event.detail.value); load(true) }
function changeStage(event: { detail: { value: string } }) { stageIndex.value = Number(event.detail.value); load(true) }
function nextPage() { if (hasMore.value) { page.value += 1; load() } }
function selectSite() { uni.showToast({ title: '工地详情即将上线', icon: 'none' }) }
onMounted(() => load(true))
</script>

<template>
  <view class="page">
    <view class="intro"><text class="kicker">PROJECT GALLERY</text><text class="title">在建工地</text><text class="lead">看得见的过程，才是安心的交付</text></view>
    <view class="filters"><picker :range="districts" :value="districtIndex" @change="changeDistrict"><view class="filter">{{ districts[districtIndex] }} <text>⌄</text></view></picker><picker :range="stages" range-key="label" :value="stageIndex" @change="changeStage"><view class="filter">{{ stages[stageIndex].label }} <text>⌄</text></view></picker></view>
    <ContentState v-if="status !== 'ready'" :status="status === 'ready' ? 'loading' : status" :message="status === 'empty' ? '暂无符合条件的工地' : message" @retry="load(true)" />
    <view v-else class="list"><SiteCard v-for="site in items" :key="site._id" :site="site" @select="selectSite" /><button v-if="hasMore" class="load-more" @click="nextPage">加载更多</button><text v-else class="end">— 已展示全部工地 —</text></view>
  </view>
</template>

<style scoped>
.page { min-height:100vh; padding-bottom:70rpx; background:#f4f6f4; }.intro { padding:70rpx 32rpx 42rpx; background:#183d34; color:#fff; }.kicker { display:block; color:#d7aa6d; letter-spacing:4rpx; font-size:20rpx; }.title { display:block; margin-top:13rpx; font-size:48rpx; font-weight:650; }.lead { display:block; margin-top:15rpx; color:rgba(255,255,255,.68); font-size:24rpx; }.filters { display:flex; gap:18rpx; padding:25rpx 30rpx; position:sticky; top:0; z-index:2; background:rgba(244,246,244,.96); }.filters picker { flex:1; }.filter { padding:20rpx 22rpx; border-radius:12rpx; color:#334b45; background:#fff; font-size:25rpx; box-shadow:0 5rpx 20rpx rgba(25,61,52,.05); }.filter text { float:right; color:#9ba7a3; }.list { display:flex; flex-direction:column; gap:28rpx; padding:8rpx 30rpx; }.load-more { margin:12rpx 0 0; border:1rpx solid #b9c8c3; border-radius:36rpx; color:#245c50; background:transparent; font-size:25rpx; }.load-more::after { border:0; }.end { padding:20rpx; text-align:center; color:#99a5a1; font-size:22rpx; }
</style>
