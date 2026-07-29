<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getSiteFilters, listSites } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import DemoModeBadge from '../../components/demo-mode-badge.vue'
import FloatingWechatService from '../../components/floating-wechat-service.vue'
import SiteCard from '../../components/site-card.vue'
import type { CaseCategory, SiteSummary } from '../../types/domain'
import { createRequestGate } from '../../utils/request-gate'
import { siteDetailUrl } from '../../utils/site-navigation'
import { hasMoreListPages, mergeListPage, PRIMARY_LIST_PAGE_SIZE } from '../../utils/list-pagination'

const PAGE_SIZE = PRIMARY_LIST_PAGE_SIZE
const STORE_ID = 'store_windoors_demo'
const categoryOptions: Array<{ label: string; value?: CaseCategory }> = [
  { label: '全部类别' },
  { label: '隔音封窗', value: 'soundproof' },
  { label: '阳台封窗', value: 'balcony' },
  { label: '旧窗改造', value: 'renovation' },
  { label: '商业门窗', value: 'commercial' },
]
const districts = ref<string[]>([])
const districtIndex = ref(0), categoryIndex = ref(0), page = ref(1)
const keyword = ref(''), appliedKeyword = ref('')
const selectedCategory = computed(() => categoryOptions[categoryIndex.value].value)
const items = ref<SiteSummary[]>([]), hasMore = ref(true), loadingMore = ref(false)
const status = ref<'loading' | 'ready' | 'empty' | 'error' | 'offline'>('loading'), message = ref('')
const gate = createRequestGate()

async function load(reset = false) {
  const request = reset ? gate.beginReset() : gate.beginMore()
  if (request == null) return
  if (reset) { page.value = 1; items.value = []; hasMore.value = true }
  else page.value += 1
  if (reset) status.value = 'loading'
  else loadingMore.value = true
  message.value = ''
  try {
    const result = await listSites({
      storeId: STORE_ID,
      page: page.value,
      pageSize: PAGE_SIZE,
      district: districtIndex.value ? districts.value[districtIndex.value - 1] : undefined,
      keyword: appliedKeyword.value,
      category: selectedCategory.value,
    })
    if (!gate.isCurrent(request)) return
    items.value = mergeListPage(items.value, result.items, reset)
    hasMore.value = hasMoreListPages(result.items.length, PAGE_SIZE)
    status.value = items.value.length ? 'ready' : 'empty'
  } catch (error) {
    if (!gate.isCurrent(request)) return
    const text = error instanceof Error ? error.message : String(error)
    if (reset) {
      status.value = /network|offline|网络/i.test(text) ? 'offline' : 'error'
      message.value = status.value === 'offline' ? '网络已断开，请检查后重试' : '案例列表加载失败'
    } else {
      page.value -= 1
      uni.showToast({ title: '加载更多失败，请重试', icon: 'none' })
    }
  } finally {
    if (!reset) loadingMore.value = false
    gate.finish(request)
  }
}
function changeDistrict(event: { detail: { value: string } }) { districtIndex.value = Number(event.detail.value); load(true) }
function changeCategory(event: { detail: { value: string } }) { categoryIndex.value = Number(event.detail.value); load(true) }
function submitSearch() { appliedKeyword.value = keyword.value.trim(); load(true) }
function clearSearch() { keyword.value = ''; appliedKeyword.value = ''; load(true) }
function nextPage() { if (hasMore.value) load() }
function selectSite(siteId: string) { uni.navigateTo({ url: siteDetailUrl(siteId) }) }
onMounted(async () => {
  try {
    const filters = await getSiteFilters(STORE_ID)
    districts.value = filters.districts
  } finally {
    load(true)
  }
})
</script>

<template>
  <view class="page">
    <DemoModeBadge />
    <view class="intro"><text class="kicker">CASE LIBRARY</text><text class="title">案例</text><text class="lead">封窗案例、楼盘资料与方案参考，报价需留下信息后获取</text></view>
    <view class="search-filter-card">
      <view class="search-row">
        <text class="search-icon">⌕</text>
        <input v-model="keyword" confirm-type="search" placeholder="搜索小区、案例名称" @confirm="submitSearch" />
        <text v-if="keyword" class="clear-search" @click="clearSearch">清除</text>
      </view>
      <view class="filters">
        <picker :range="['全部区域', ...districts]" :value="districtIndex" @change="changeDistrict"><view class="filter">{{ districtIndex ? districts[districtIndex - 1] : '全部区域' }} <text>⌄</text></view></picker>
        <picker :range="categoryOptions" range-key="label" :value="categoryIndex" @change="changeCategory"><view class="filter">{{ categoryOptions[categoryIndex].label }} <text>⌄</text></view></picker>
      </view>
    </view>
    <ContentState v-if="status !== 'ready'" :status="status === 'ready' ? 'loading' : status" :message="status === 'empty' ? '暂无符合条件的案例' : message" @retry="load(true)" />
    <button v-if="status === 'empty' && appliedKeyword" class="clear-conditions" @click="clearSearch">清除搜索条件</button>
    <view v-if="status === 'ready'" class="list"><SiteCard v-for="site in items" :key="site._id" compact :site="site" @select="selectSite" /><button v-if="hasMore" class="load-more" :disabled="loadingMore" @click="nextPage">{{ loadingMore ? '加载中…' : '加载更多' }}</button><text v-else class="end">— 已展示全部案例 —</text></view>
    <FloatingWechatService placement="tabbar" />
  </view>
</template>

<style scoped>
.page { min-height:100vh; padding-bottom:calc(70rpx + env(safe-area-inset-bottom)); background:#f4f6f4; }.intro { padding:70rpx 32rpx 42rpx; background:#183d34; color:#fff; }.kicker { display:block; color:#d7aa6d; letter-spacing:4rpx; font-size:20rpx; }.title { display:block; margin-top:13rpx; font-size:48rpx; font-weight:650; }.lead { display:block; margin-top:15rpx; color:rgba(255,255,255,.68); font-size:24rpx; }.search-filter-card{position:sticky;top:0;z-index:2;margin:22rpx 30rpx;padding:18rpx;border-radius:24rpx;background:#fff;box-shadow:0 10rpx 28rpx rgba(25,61,52,.08)}.search-row{display:flex;align-items:center;min-height:88rpx;padding:0 20rpx;border-radius:18rpx;background:#f5f8f6}.search-icon{margin-right:14rpx;color:#b67b2c;font-size:34rpx}.search-row input{flex:1;color:#193c33;font-size:26rpx}.clear-search{display:flex;align-items:center;min-height:88rpx;padding-left:20rpx;color:#256153;font-size:24rpx}.filters{display:flex;gap:14rpx;margin-top:14rpx}.filters picker{flex:1;min-width:0}.filter{padding:18rpx 20rpx;border-radius:14rpx;color:#334b45;background:#f5f8f6;font-size:24rpx}.filter text{float:right;color:#9ba7a3}.clear-conditions{width:300rpx;min-height:88rpx;margin:10rpx auto 24rpx;border:0;border-radius:44rpx;color:#fff;background:#256153;font-size:25rpx;line-height:88rpx}.clear-conditions::after{border:0}.list { display:flex; flex-direction:column; gap:28rpx; padding:8rpx 30rpx; }.load-more { margin:12rpx 0 0; border:1rpx solid #b9c8c3; border-radius:36rpx; color:#245c50; background:transparent; font-size:25rpx; }.load-more::after { border:0; }.end { padding:20rpx; text-align:center; color:#99a5a1; font-size:22rpx; }
</style>
<style scoped>.list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20rpx}.load-more,.end{grid-column:1 / -1}</style>
