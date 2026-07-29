<script setup lang="ts">
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getProductDetail } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import DetailActionBar from '../../components/detail-action-bar.vue'
import FloatingWechatService from '../../components/floating-wechat-service.vue'
import ServiceCard from '../../components/service-card.vue'
import type { ProductDetail } from '../../types/domain'
import { classifyDetailError } from '../../utils/detail-state'
import { shareMessage, timelineMessage } from '../../utils/content-sharing'
import { constructionDetailUrl } from '../../utils/site-navigation'
import { showDemoUnavailable } from '../../config/demo-isolation'
const id=ref(''),product=ref<ProductDetail>(),status=ref<'loading'|'ready'|'empty'|'error'|'offline'>('loading'),message=ref('')
async function load(){if(!id.value){status.value='empty';message.value='该产品不存在';return}status.value='loading';try{product.value=await getProductDetail(id.value);status.value='ready'}catch(error){const failure=classifyDetailError(error);status.value=failure.status;message.value=failure.retryable?'产品详情加载失败':'该产品已下架或不存在'}}
function appoint(){if(showDemoUnavailable(uni,'预约咨询'))return;if(product.value)uni.navigateTo({url:`/pages-sub/appointments/create?source_type=product&source_id=${encodeURIComponent(product.value._id)}&store_id=${encodeURIComponent(product.value.store_id)}`})}
function openSite(siteId:string){const item=product.value?.related_sites.find(site=>site._id===siteId);uni.navigateTo({url:item?.service_type==='warranty'?`/pages-sub/services/detail?id=${encodeURIComponent(siteId)}`:constructionDetailUrl(siteId)})}
onLoad((query:Record<string,string|undefined>)=>{id.value=query.id||'';load()})
onShareAppMessage(()=>product.value?shareMessage('product',product.value._id,`推荐：${product.value.name}`,product.value.cover_image):{})
onShareTimeline(()=>product.value?timelineMessage(`推荐：${product.value.name}`,product.value.cover_image):{})
</script>
<template>
  <view class="page">
    <ContentState v-if="status!=='ready'" :status="status" :message="message" @retry="load"/>
    <template v-else-if="product">
      <swiper class="hero" indicator-dots><swiper-item v-for="image in [product.cover_image,...product.gallery]" :key="image"><image :src="image" mode="aspectFill"/></swiper-item></swiper>
      <view class="panel headline"><text class="kicker">PRODUCT DETAIL</text><text class="title">{{product.name}}</text><text class="summary">{{product.summary}}</text></view>
      <view v-if="product.highlights.length" class="panel"><text class="section-title">产品亮点</text><view v-for="item in product.highlights" :key="item" class="line"><text class="dot"/>{{item}}</view></view>
      <view v-if="product.specifications.length" class="panel"><text class="section-title">规格参数</text><view v-for="item in product.specifications" :key="item" class="spec">{{item}}</view></view>
      <view class="related-sites">
        <text class="section-title">近期选用的工地</text>
        <text class="case-count">{{product.related_sites.length?'展示正在施工中或质保中的相关工地':'相关工地选用记录将在这里展示'}}</text>
        <scroll-view v-if="product.related_sites.length" scroll-x class="case-scroll"><view class="case-row"><view v-for="site in product.related_sites.slice(0,3)" :key="site._id" class="case-item"><ServiceCard :item="site" compact @select="openSite"/></view></view></scroll-view>
        <view v-else class="empty-cases"><text>暂无公开的近期选用工地</text><text>工地进入施工或质保阶段后会展示在这里</text></view>
      </view>
      <DetailActionBar type="product" :content-id="product._id" :title="product.name" :image="product.cover_image" :return-url="`/pages-sub/products/detail?id=${encodeURIComponent(product._id)}`" @appoint="appoint"/>
    </template>
    <FloatingWechatService placement="actionbar" />
  </view>
</template>
<style scoped>.page{min-height:100vh;padding-bottom:150rpx;background:#f1f4f2}.hero,.hero image{width:100%;height:540rpx}.panel,.related-sites{margin:22rpx 26rpx;padding:32rpx;border-radius:20rpx;background:#fff}.headline{position:relative;margin-top:-38rpx}.kicker{display:block;color:#a4773f;font-size:19rpx;letter-spacing:3rpx}.title{display:block;margin-top:12rpx;color:#183b32;font-size:40rpx;font-weight:650}.summary{display:block;margin-top:16rpx;color:#687873;font-size:25rpx;line-height:1.7}.section-title{display:block;color:#193c33;font-size:31rpx;font-weight:650}.panel>.section-title{margin-bottom:22rpx}.line{display:flex;align-items:center;gap:14rpx;padding:13rpx 0;color:#52655e;font-size:25rpx}.dot{width:10rpx;height:10rpx;border-radius:50%;background:#b98449}.spec{padding:17rpx 0;border-top:1rpx solid #edf0ef;color:#52655e;font-size:24rpx}.case-count{display:block;margin-top:8rpx;color:#8a9893;font-size:21rpx}.case-scroll{width:100%;margin-top:24rpx;white-space:nowrap}.case-row{display:flex;gap:18rpx}.case-item{flex:0 0 430rpx;white-space:normal}.case-item :deep(.cover){height:250rpx}.case-item :deep(.body){padding:22rpx}.case-item :deep(.title){font-size:29rpx}.case-item :deep(.summary){display:none}.case-item :deep(.meta){flex-direction:column;gap:8rpx}.empty-cases{margin-top:24rpx;padding:38rpx 22rpx;border-radius:14rpx;text-align:center;background:#f5f7f6}.empty-cases text{display:block;color:#788782;font-size:23rpx}.empty-cases text+text{margin-top:9rpx;color:#a0aaa6;font-size:20rpx}</style>
