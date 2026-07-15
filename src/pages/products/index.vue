<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { listProducts } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import PrimaryPageIntro from '../../components/primary-page-intro.vue'
import type { ProductCategory, ProductSummary } from '../../types/domain'

const STORE_ID = 'store_windoors_demo'
const categories: Array<{value?:ProductCategory;label:string}> = [{label:'全部'}, {value:'system_window',label:'系统门窗'}, {value:'bridge_aluminum',label:'断桥铝'}, {value:'sliding_door',label:'推拉门'}, {value:'sunroom',label:'阳光房'}, {value:'screen_accessory',label:'纱窗配套'}]
const active = ref(0), products = ref<ProductSummary[]>([]), status = ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'), message = ref('')

async function load() {
  status.value='loading';message.value=''
  try { const result=await listProducts({storeId:STORE_ID,category:categories[active.value].value,pageSize:20});products.value=result.items;status.value=products.value.length?'ready':'empty' }
  catch (error:any) { status.value=String(error?.errMsg||'').includes('network')?'offline':'error';message.value='产品加载失败，请稍后重试' }
}
function selectCategory(index:number){active.value=index;load()}
function openProduct(id:string){uni.navigateTo({url:`/pages-sub/products/detail?id=${encodeURIComponent(id)}`})}
onShow(load)
</script>

<template><view class="page"><PrimaryPageIntro kicker="WINDOW COLLECTION" title="门窗产品" lead="按空间与使用需求，找到适合你的门窗方案" />
  <scroll-view scroll-x class="categories"><view class="category-row"><button v-for="(item,index) in categories" :key="item.label" :class="{active:active===index}" @click="selectCategory(index)">{{item.label}}</button></view></scroll-view>
  <ContentState v-if="status!=='ready'" :status="status" :message="status==='empty'?'暂无已发布产品':message" @retry="load"/>
  <view v-else class="grid"><button v-for="product in products" :key="product._id" class="card" @click="openProduct(product._id)"><image :src="product.cover_image" mode="aspectFill"/><view class="body"><text class="name">{{product.name}}</text><text class="summary">{{product.summary}}</text><view class="more">查看详情 <text>›</text></view></view></button></view>
</view></template>

<style scoped>.page{min-height:100vh;padding-bottom:calc(110rpx + env(safe-area-inset-bottom));background:#f4f6f4}.categories{white-space:nowrap;background:#fff;border-bottom:1rpx solid #e8ece9}.category-row{display:flex;gap:14rpx;padding:22rpx 28rpx}.category-row button{flex:none;margin:0;padding:0 26rpx;height:62rpx;line-height:62rpx;border-radius:32rpx;border:0;background:#eef2ef;color:#65756f;font-size:23rpx}.category-row button::after,.card::after{border:0}.category-row .active{background:#1f5a4d;color:#fff}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20rpx;padding:26rpx}.card{min-width:0;margin:0;padding:0;overflow:hidden;border-radius:20rpx;text-align:left;background:#fff;box-shadow:0 8rpx 24rpx rgba(31,62,53,.06)}.card image{width:100%;height:240rpx}.body{padding:22rpx}.name,.summary{display:block}.name{color:#203a33;font-size:29rpx;font-weight:650}.summary{display:-webkit-box;margin-top:10rpx;overflow:hidden;color:#778680;font-size:22rpx;line-height:1.6;-webkit-line-clamp:2;-webkit-box-orient:vertical}.more{margin-top:18rpx;color:#9a703e;font-size:22rpx;font-weight:600}.more text{font-size:28rpx}@media(max-width:360px){.grid{grid-template-columns:1fr}.card image{height:340rpx}}</style>
