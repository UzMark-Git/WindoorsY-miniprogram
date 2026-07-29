<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { listProducts } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import DemoModeBadge from '../../components/demo-mode-badge.vue'
import FloatingWechatService from '../../components/floating-wechat-service.vue'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import type { ProductCategory, ProductSummary } from '../../types/domain'
import { createRequestGate } from '../../utils/request-gate'
import { hasMoreListPages, mergeListPage, PRIMARY_LIST_PAGE_SIZE } from '../../utils/list-pagination'

const STORE_ID = 'store_windoors_demo'
const PAGE_SIZE = PRIMARY_LIST_PAGE_SIZE
const placeholder = '/static/demo/placeholder.png'
const categories: Array<{value?:ProductCategory;label:string}> = [{label:'全部'}, {value:'system_window',label:'系统门窗'}, {value:'bridge_aluminum',label:'断桥铝'}, {value:'sliding_door',label:'推拉门'}, {value:'sunroom',label:'阳光房'}, {value:'screen_accessory',label:'纱窗配套'}]
const categoryLabels: Record<ProductCategory, string> = {
  system_window: '系统门窗',
  bridge_aluminum: '断桥铝',
  sliding_door: '推拉门',
  sunroom: '阳光房',
  screen_accessory: '纱窗配套',
}
const active = ref(0), page = ref(1), products = ref<ProductSummary[]>([]), hasMore = ref(true), loadingMore = ref(false), status = ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'), message = ref('')
const failedImages = ref<Record<string, boolean>>({})
const gate = createRequestGate()

async function load(reset = false) {
  const request = reset ? gate.beginReset() : gate.beginMore()
  if (request == null) return
  const requestPage = reset ? 1 : page.value + 1
  if (reset) {
    status.value = 'loading'
    failedImages.value = {}
  } else {
    loadingMore.value = true
  }
  message.value = ''
  try {
    const result = await listProducts({ storeId: STORE_ID, category: categories[active.value].value, page: requestPage, pageSize: PAGE_SIZE })
    if (!gate.isCurrent(request)) return
    page.value = requestPage
    products.value = mergeListPage(products.value, result.items, reset)
    hasMore.value = hasMoreListPages(result.items.length, PAGE_SIZE)
    status.value = products.value.length ? 'ready' : 'empty'
  } catch (error: any) {
    if (!gate.isCurrent(request)) return
    if (reset) {
      status.value = String(error?.errMsg || '').includes('network') ? 'offline' : 'error'
      message.value = '产品加载失败，请稍后重试'
    } else {
      uni.showToast({ title: '加载更多失败，请重试', icon: 'none' })
    }
  } finally {
    loadingMore.value = false
    gate.finish(request)
  }
}
function selectCategory(index:number){active.value=index;load(true)}
function more(){if(hasMore.value)load()}
function productImage(product:ProductSummary){return failedImages.value[product._id]?placeholder:(product.cover_image||placeholder)}
function failImage(id:string){failedImages.value[id]=true}
function openProduct(id:string){uni.navigateTo({url:`/pages-sub/products/detail?id=${encodeURIComponent(id)}`})}
onShow(()=>load(true))
</script>

<template><view class="page"><DemoModeBadge/><PrimaryPageIntro kicker="WINDOW COLLECTION" title="门窗产品" lead="按空间与使用需求，找到适合你的门窗方案" />
  <scroll-view scroll-x class="categories"><view class="category-row"><button v-for="(item,index) in categories" :key="item.label" :class="{active:active===index}" @click="selectCategory(index)">{{item.label}}</button></view></scroll-view>
  <ContentState v-if="status!=='ready'" :status="status" :message="status==='empty'?'暂无已发布产品':message" @retry="load(true)"/>
  <view v-else class="grid"><button v-for="product in products" :key="product._id" class="card" @click="openProduct(product._id)"><image :src="productImage(product)" mode="aspectFill" @error="failImage(product._id)"/><view class="body"><view class="product-topline"><text class="product-category">{{ categoryLabels[product.category] }}</text><text class="price-note">价格需咨询</text></view><text class="name">{{product.name}}</text><text class="summary">{{product.summary}}</text><view class="card-more">查看详情 <text>›</text></view></view></button><button v-if="hasMore" class="load-more" :disabled="loadingMore" @click="more">{{loadingMore?'加载中…':'加载更多'}}</button><text v-else class="end">— 已展示全部产品 —</text></view>
<FloatingWechatService placement="tabbar" />
</view></template>

<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.categories{white-space:nowrap;background:#fff;border-bottom:1rpx solid #e8ece9}.category-row{display:flex;gap:14rpx;padding:22rpx 28rpx}.category-row button{flex:none;margin:0;padding:0 26rpx;height:62rpx;line-height:62rpx;border-radius:32rpx;border:0;background:#eef2ef;color:#65756f;font-size:23rpx}.category-row button::after,.card::after,.load-more::after{border:0}.category-row .active{background:#1f5a4d;color:#fff}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20rpx;padding:26rpx}.card{min-width:0;margin:0;padding:0;overflow:hidden;border-radius:20rpx;text-align:left;background:#fff;box-shadow:0 8rpx 24rpx rgba(31,62,53,.06)}.card image{width:100%;height:240rpx}.body{padding:22rpx}.product-topline{display:flex;align-items:center;justify-content:space-between;gap:10rpx;overflow:hidden}.product-category{flex:none;max-width:55%;padding:6rpx 10rpx;overflow:hidden;border-radius:8rpx;color:#245c50;background:#e5f0ed;font-size:18rpx;font-weight:600;line-height:1.4;white-space:nowrap;text-overflow:ellipsis}.price-note{min-width:0;overflow:hidden;color:#b17632;font-size:18rpx;line-height:1.4;white-space:nowrap;text-overflow:ellipsis}.name,.summary{display:block}.name{margin-top:13rpx;color:#203a33;font-size:29rpx;font-weight:650}.summary{display:-webkit-box;margin-top:6rpx;overflow:hidden;color:#778680;font-size:22rpx;line-height:1.45;-webkit-line-clamp:2;-webkit-box-orient:vertical}.card-more{margin-top:12rpx;color:#9a703e;font-size:22rpx;font-weight:600}.card-more text{font-size:28rpx}.load-more{grid-column:1 / -1;margin:12rpx 0 0;border:1rpx solid #b9c8c3;border-radius:36rpx;color:#245c50;background:transparent;font-size:25rpx}.end{grid-column:1 / -1;padding:20rpx;text-align:center;color:#99a5a1;font-size:22rpx}@media(max-width:360px){.grid{grid-template-columns:1fr}.card image{height:340rpx}}</style>
