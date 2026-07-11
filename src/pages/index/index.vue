<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHome } from '../../api/content'
import ContentState from '../../components/content-state.vue'
import SiteCard from '../../components/site-card.vue'
import type { HomeContent } from '../../types/domain'

const STORE_ID = 'store_windoors_demo'
const home = ref<HomeContent>()
const status = ref<'loading' | 'ready' | 'empty' | 'error' | 'offline'>('loading')
const message = ref('')
const placeholder = '/static/demo/placeholder.png'
const heroSrc = ref(placeholder)
const failedAvatars = ref<Record<string, boolean>>({})

async function load() {
  status.value = 'loading'
  message.value = ''
  try {
    home.value = await getHome(STORE_ID)
    heroSrc.value = home.value?.store.hero_images[0] || placeholder
    status.value = home.value ? 'ready' : 'empty'
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error)
    status.value = /network|offline|网络/i.test(text) ? 'offline' : 'error'
    message.value = status.value === 'offline' ? '网络已断开，请检查后重试' : '首页加载失败，请稍后重试'
  }
}

function openSites() { uni.navigateTo({ url: '/pages/sites/index' }) }
function callStore() { if (home.value) uni.makePhoneCall({ phoneNumber: home.value.store.phone }) }
function copyAddress() { if (home.value) uni.setClipboardData({ data: home.value.store.address }) }
function selectSite() { openSites() }
onMounted(load)
</script>

<template>
  <view class="page">
    <ContentState v-if="status !== 'ready'" :status="status === 'ready' ? 'loading' : status" :message="message" @retry="load" />
    <template v-else-if="home">
      <view class="hero">
        <image class="hero-image" :src="heroSrc" mode="aspectFill" @error="heroSrc = placeholder" />
        <view class="veil" />
        <view class="hero-copy"><text class="eyebrow">专属门窗服务</text><text class="hero-title">{{ home.store.name }}</text><text class="address">{{ home.store.address }}</text></view>
      </view>
      <view class="actions"><button @click="callStore"><text class="action-icon">☎</text><text>电话咨询</text></button><view class="divider" /><button @click="copyAddress"><text class="action-icon">◇</text><text>门店地址</text></button></view>
      <view class="section">
        <view class="heading"><view><text class="kicker">SERVICE TEAM</text><text class="section-title">为你服务的人</text></view></view>
        <scroll-view scroll-x class="staff-scroll"><view class="staff-row"><view v-for="person in home.staff" :key="person._id" class="person"><image :src="failedAvatars[person._id] ? placeholder : (person.avatar || placeholder)" mode="aspectFill" @error="failedAvatars[person._id] = true" /><view><text class="person-name">{{ person.name }}</text><text class="person-role">{{ person.role }}</text></view></view></view></scroll-view>
      </view>
      <view class="section sites"><view class="heading"><view><text class="kicker">SELECTED PROJECTS</text><text class="section-title">近期精选工地</text></view><text class="more" @click="openSites">查看全部 ›</text></view><view class="cards"><SiteCard v-for="site in home.sites.slice(0, 3)" :key="site._id" :site="site" @select="selectSite" /></view></view>
    </template>
  </view>
</template>

<style scoped>
.page { min-height: 100vh; padding-bottom: 70rpx; background: #f4f6f4; }
.hero { position: relative; height: 610rpx; overflow: hidden; }
.hero-image,.veil { position: absolute; inset: 0; width: 100%; height: 100%; }
.veil { background: linear-gradient(180deg,rgba(10,30,25,.08),rgba(10,30,25,.78)); }
.hero-copy { position: absolute; left: 40rpx; right: 40rpx; bottom: 62rpx; color: white; }
.eyebrow,.kicker { display: block; letter-spacing: 4rpx; font-size: 20rpx; font-weight: 600; }
.hero-title { display: block; margin-top: 18rpx; font-size: 52rpx; font-weight: 650; }
.address { display: block; margin-top: 18rpx; color: rgba(255,255,255,.82); font-size: 25rpx; }
.actions { display: flex; align-items: center; margin: -25rpx 30rpx 0; position: relative; border-radius: 22rpx; background: white; box-shadow: 0 10rpx 40rpx rgba(20,55,46,.12); }
.actions button { flex: 1; height: 116rpx; display: flex; align-items: center; justify-content: center; gap: 14rpx; border: 0; background: transparent; color: #27433c; font-size: 26rpx; }
.actions button::after { border: 0; }.action-icon { color: #b8823e; font-size: 34rpx; }.divider { width: 1rpx; height: 50rpx; background: #e3e8e6; }
.section { padding: 62rpx 30rpx 0; }.heading { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom: 28rpx; }.kicker { color: #a57941; }.section-title { display:block; margin-top:10rpx; color:#172d28; font-size:38rpx; font-weight:650; }.more { color:#567069; font-size:24rpx; }
.staff-scroll { width: 100%; white-space: nowrap; }.staff-row { display:flex; gap:18rpx; }.person { flex: 0 0 370rpx; display:flex; align-items:center; gap:20rpx; padding:22rpx; border-radius:18rpx; background:#fff; }.person image { width:92rpx; height:92rpx; border-radius:50%; background:#e6edeb; }.person-name,.person-role { display:block; }.person-name { color:#203832; font-size:28rpx; font-weight:600; }.person-role { margin-top:8rpx; color:#7d8985; font-size:22rpx; }.cards { display:flex; flex-direction:column; gap:28rpx; }
</style>
