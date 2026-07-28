<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHome } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import ServiceCard from '../../components/service-card.vue'
import type { HomeContent } from '../../types/domain'
import { markHeroImageFailed, normalizeHeroImages, resolveHeroImage } from '../../utils/hero-carousel'
import { navigateToLegalPage } from '../../utils/legal-navigation'
import { constructionDetailUrl } from '../../utils/site-navigation'

const STORE_ID = 'store_windoors_demo'
const home = ref<HomeContent>()
const status = ref<'loading' | 'ready' | 'empty' | 'error' | 'offline'>('loading')
const message = ref('')
const placeholder = '/static/demo/placeholder.png'
const heroImages = ref<string[]>([placeholder])
const failedHeroImages = ref<Record<number, boolean>>({})
const failedAvatars = ref<Record<string, boolean>>({})

async function load() {
  status.value = 'loading'
  message.value = ''
  try {
    home.value = await getHome(STORE_ID)
    heroImages.value = normalizeHeroImages(home.value?.store.hero_images, placeholder)
    failedHeroImages.value = {}
    status.value = home.value ? 'ready' : 'empty'
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error)
    status.value = /network|offline|网络/i.test(text) ? 'offline' : 'error'
    message.value = status.value === 'offline' ? '网络已断开，请检查后重试' : '首页加载失败，请稍后重试'
  }
}

function failHero(index: number) {
  failedHeroImages.value = markHeroImageFailed(failedHeroImages.value, index)
}

function openLegal(url: string) { navigateToLegalPage(url, uni) }
function openServices() { uni.switchTab({ url: '/pages/services/index' }) }
function openProducts() { uni.switchTab({ url: '/pages/products/index' }) }
function openSearch(){uni.navigateTo({url:'/pages-sub/search/index'})}
function selectService(item:HomeContent['services'][number]) { uni.navigateTo({url:item.service_type==='warranty'?`/pages-sub/services/detail?id=${encodeURIComponent(item._id)}`:constructionDetailUrl(item._id)}) }
function selectStaff(person: HomeContent['staff'][number]) { uni.navigateTo({ url: `/pages-sub/staff/detail?id=${encodeURIComponent(person._id)}` }) }
function selectProduct(id: string) { uni.navigateTo({ url: `/pages-sub/products/detail?id=${encodeURIComponent(id)}` }) }
onMounted(load)
</script>

<template>
  <view class="page">
    <ContentState v-if="status !== 'ready'" :status="status === 'ready' ? 'loading' : status" :message="message" @retry="load" />
    <template v-else-if="home">
      <view class="hero">
        <swiper
          class="hero-swiper"
          indicator-dots
          indicator-color="rgba(255,255,255,.45)"
          indicator-active-color="#fff"
          :autoplay="heroImages.length > 1"
          :circular="heroImages.length > 1"
          :interval="4000"
        >
          <swiper-item v-for="(image, index) in heroImages" :key="`${index}-${image}`" class="hero-slide">
            <image
              class="hero-image"
              :src="resolveHeroImage(heroImages, failedHeroImages, index, placeholder)"
              mode="aspectFill"
              :aria-label="`${home.store.name}轮播图${index + 1}`"
              @error="failHero(index)"
            />
            <view class="veil" />
          </swiper-item>
        </swiper>
        <view class="hero-copy"><text class="eyebrow">专属门窗服务</text><text class="hero-title">{{ home.store.name }}</text><text class="address">{{ home.store.address }}</text></view>
      </view>
      <view class="search-entry" hover-class="search-entry--pressed" @click="openSearch"><text class="search-icon">⌕</text><text class="search-placeholder">搜索一下，找到你家封窗方案与报价~</text></view>
      <view class="section">
        <view class="heading"><view><text class="kicker">SERVICE TEAM</text><text class="section-title">为你服务的人</text></view></view>
        <scroll-view scroll-x class="staff-scroll"><view class="staff-row"><button v-for="person in home.staff" :key="person._id" class="person" :aria-label="`查看${person.name}的人员详情`" @click="selectStaff(person)"><image :src="failedAvatars[person._id] ? placeholder : (person.avatar || placeholder)" mode="aspectFill" :aria-label="`${person.name}头像`" @error="failedAvatars[person._id] = true" /><view><text class="person-name">{{ person.name }}</text><text class="person-role">{{ person.role }}</text></view></button></view></scroll-view>
      </view>
      <view v-if="home.products.length" class="section products"><view class="heading"><view><text class="kicker">FEATURED WINDOWS</text><text class="section-title">精选门窗产品</text></view><text class="more" @click="openProducts">查看全部 ›</text></view><scroll-view scroll-x class="product-scroll"><view class="product-row"><button v-for="product in home.products" :key="product._id" class="product" @click="selectProduct(product._id)"><image :src="product.cover_image || placeholder" mode="aspectFill"/><text class="product-name">{{product.name}}</text><text class="product-summary">{{product.summary}}</text></button></view></scroll-view></view>
      <view class="section sites"><view class="heading"><view><text class="kicker">RECENT PROJECTS</text><text class="section-title">近期施工与质保</text></view><text class="more" @click="openServices">查看全部 ›</text></view><view class="cards"><ServiceCard v-for="item in home.services.slice(0, 3)" :key="item._id" :item="item" compact @select="selectService(item)" /></view></view>
    </template>
    <view class="legal-links">
      <text @click="openLegal('/pages/legal/service-agreement')">用户服务协议</text>
      <text class="dot">·</text>
      <text @click="openLegal('/pages/legal/privacy-policy')">隐私政策</text>
    </view>
  </view>
</template>

<style scoped>
.page { min-height: 100vh; padding-bottom: calc(70rpx + env(safe-area-inset-bottom)); background: #f4f6f4; }
.hero { position: relative; height: 610rpx; overflow: hidden; }
.hero-swiper { width: 100%; height: 100%; }
.hero-slide { position: relative; }
.hero-image { width: 100%; height: 100%; }
.veil { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; background: linear-gradient(180deg,rgba(10,30,25,.08),rgba(10,30,25,.78)); }
.hero-copy { position: absolute; left: 40rpx; right: 40rpx; bottom: 62rpx; z-index: 2; color: white; }
.eyebrow,.kicker { display: block; letter-spacing: 4rpx; font-size: 20rpx; font-weight: 600; }
.hero-title { display: block; margin-top: 18rpx; font-size: 52rpx; font-weight: 650; }
.address { display: block; margin-top: 18rpx; color: rgba(255,255,255,.82); font-size: 25rpx; }
.search-entry{display:flex;align-items:center;gap:16rpx;height:92rpx;margin:-25rpx 30rpx 0;padding:0 26rpx;position:relative;border-radius:22rpx;background:white;box-shadow:0 10rpx 40rpx rgba(20,55,46,.12);transition:transform .12s,opacity .12s}.search-entry--pressed{transform:scale(.985);opacity:.88}.search-icon{color:#a57941;font-size:38rpx}.search-placeholder{flex:1;color:#8b9591;font-size:25rpx}
.section { padding: 62rpx 30rpx 0; }.heading { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom: 28rpx; }.kicker { color: #a57941; }.section-title { display:block; margin-top:10rpx; color:#172d28; font-size:38rpx; font-weight:650; }.more { color:#567069; font-size:24rpx; }
.staff-scroll { width: 100%; white-space: nowrap; }.staff-row { display:flex; gap:18rpx; }.person { flex: 0 0 370rpx; display:flex; align-items:center; gap:20rpx; margin:0; padding:22rpx; border:0; border-radius:18rpx; text-align:left; line-height:normal; background:#fff; }.person::after{border:0}.person image { width:92rpx; height:92rpx; border-radius:50%; background:#e6edeb; }.person-name,.person-role { display:block; }.person-name { color:#203832; font-size:28rpx; font-weight:600; }.person-role { margin-top:8rpx; color:#7d8985; font-size:22rpx; }.cards { display:flex; flex-direction:column; gap:28rpx; }
.product-scroll{width:100%;white-space:nowrap}.product-row{display:flex;gap:20rpx}.product{flex:0 0 310rpx;margin:0;padding:0 0 20rpx;overflow:hidden;border:0;border-radius:18rpx;text-align:left;line-height:normal;background:#fff}.product::after{border:0}.product image{width:100%;height:220rpx}.product-name,.product-summary{display:block;margin-left:20rpx;margin-right:20rpx}.product-name{margin-top:18rpx;color:#203832;font-size:27rpx;font-weight:650}.product-summary{margin-top:9rpx;overflow:hidden;color:#7d8985;font-size:21rpx;white-space:nowrap;text-overflow:ellipsis}
.legal-links { display: flex; justify-content: center; gap: 14rpx; padding: 56rpx 30rpx 12rpx; color: #74827d; font-size: 22rpx; }
.dot { color: #a6afac; }
</style>
