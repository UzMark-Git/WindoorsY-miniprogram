<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHome } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import HomeNeedsSwiper from '../../components/home/home-needs-swiper.vue'
import HomeSearchPanel from '../../components/home/home-search-panel.vue'
import HomeCaseSwiper from '../../components/home/home-case-swiper.vue'
import HomeProjectSwiper from '../../components/home/home-project-swiper.vue'
import HomeStaffStrip from '../../components/home/home-staff-strip.vue'
import HomeServiceFooter from '../../components/home/home-service-footer.vue'
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
function openCases() { uni.switchTab({ url: '/pages/sites/index' }) }
function openServices() { uni.switchTab({ url: '/pages/services/index' }) }
function openSearch(keyword = '') {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''
  uni.navigateTo({ url: `/pages-sub/search/index${query}` })
}
function openPrivateEntry(type: 'progress' | 'warranty') {
  uni.showToast({
    title: type === 'progress'
      ? '请登录后从“我的”查看项目进度'
      : '请登录后从“我的”查看质保',
    icon: 'none',
  })
  uni.switchTab({ url: '/pages/profile/index' })
}
function selectService(item:HomeContent['projects'][number]) { uni.navigateTo({url:item.service_type==='warranty'?`/pages-sub/services/detail?id=${encodeURIComponent(item._id)}`:constructionDetailUrl(item._id)}) }
function selectCase(id: string) { uni.navigateTo({ url: `/pages-sub/sites/detail?id=${encodeURIComponent(id)}` }) }
function selectStaff(id: string) { uni.navigateTo({ url: `/pages-sub/staff/detail?id=${encodeURIComponent(id)}` }) }
function openWarranty() {
  if (home.value?.warranty?._id) {
    uni.navigateTo({ url: `/pages-sub/services/detail?id=${encodeURIComponent(home.value.warranty._id)}` })
    return
  }
  uni.switchTab({ url: '/pages/services/index' })
}
function openStoreInfo() {
  const store = home.value?.store
  if (!store) return
  const address = store.address || '请致电门店确认地址'
  if (!store.phone) {
    uni.showModal({ title: `${store.name}实体门店`, content: `地址：${address}`, showCancel: false })
    return
  }
  uni.showModal({
    title: `${store.name}实体门店`,
    content: `地址：${address}\n电话：${store.phone}`,
    confirmText: '电话咨询',
    success: result => { if (result.confirm) uni.makePhoneCall({ phoneNumber: store.phone }) },
  })
}
onMounted(load)
</script>

<template>
  <view class="page">
    <ContentState v-if="status !== 'ready'" :status="status === 'ready' ? 'loading' : status" :message="message" @retry="load" />
    <template v-else-if="home">
      <view class="hero">
        <image class="hero-image" :src="resolveHeroImage(heroImages, failedHeroImages, 0, placeholder)" mode="aspectFill" :aria-label="`${home.store.name}门店窗景`" @error="failHero(0)" />
        <view class="veil" />
        <view class="hero-copy"><text class="eyebrow">南昌本地门窗服务</text><text class="hero-title">门窗老伙计</text><text class="hero-lead">产品、案例、施工记录与十年质保都在这里</text></view>
      </view>
      <HomeSearchPanel class="home-search-panel" @search="openSearch" @private-entry="openPrivateEntry" />
      <view class="section needs"><view class="heading"><view><text class="kicker">WINDOW SOLUTIONS</text><text class="section-title">你家想解决什么问题？</text></view></view><HomeNeedsSwiper @select="openSearch" /></view>
      <view class="section">
        <view class="heading"><view><text class="kicker">SERVICE TEAM</text><text class="section-title">为你服务的人</text></view></view>
        <HomeStaffStrip :items="home.staff" :placeholder="placeholder" @select="selectStaff" />
      </view>
      <view v-if="home.cases.length" class="section cases"><HomeCaseSwiper :items="home.cases" :placeholder="placeholder" @select="selectCase" @all="openCases" /></view>
      <view v-if="home.projects.length" class="section sites"><HomeProjectSwiper :items="home.projects" :placeholder="placeholder" @select="selectService" @all="openServices" /></view>
      <view class="section service-footer-section"><HomeServiceFooter :store="home.store" :warranty="home.warranty" @warranty="openWarranty" @store="openStoreInfo" /></view>
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
.hero-image { width: 100%; height: 100%; }
.veil { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; background: linear-gradient(180deg,rgba(10,30,25,.08),rgba(10,30,25,.78)); }
.hero-copy { position: absolute; left: 40rpx; right: 40rpx; bottom: 62rpx; z-index: 2; color: white; }
.eyebrow,.kicker { display: block; letter-spacing: 4rpx; font-size: 20rpx; font-weight: 600; }
.hero-title { display: block; margin-top: 18rpx; font-size: 52rpx; font-weight: 650; }
.hero-lead { display:block; margin-top:18rpx; color:rgba(255,255,255,.86); font-size:25rpx; }
.home-search-panel{display:block;margin:-44rpx 30rpx 0}
.section { padding: 62rpx 30rpx 0; }.heading { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom: 28rpx; }.kicker { color: #a57941; }.section-title { display:block; margin-top:10rpx; color:#172d28; font-size:38rpx; font-weight:650; }.more { color:#567069; font-size:24rpx; }
.needs{padding-top:54rpx}
.product-scroll{width:100%;white-space:nowrap}.product-row{display:flex;gap:20rpx}.product{flex:0 0 310rpx;margin:0;padding:0 0 20rpx;overflow:hidden;border:0;border-radius:18rpx;text-align:left;line-height:normal;background:#fff}.product::after{border:0}.product image{width:100%;height:220rpx}.product-name,.product-summary{display:block;margin-left:20rpx;margin-right:20rpx}.product-name{margin-top:18rpx;color:#203832;font-size:27rpx;font-weight:650}.product-summary{margin-top:9rpx;overflow:hidden;color:#7d8985;font-size:21rpx;white-space:nowrap;text-overflow:ellipsis}
.service-footer-section { padding-bottom: 14rpx; }
.legal-links { display: flex; justify-content: center; gap: 14rpx; padding: 56rpx 30rpx 12rpx; color: #74827d; font-size: 22rpx; }
.dot { color: #a6afac; }
</style>
