<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { getHome, listServices } from '../../api/content'
import FloatingWechatService from '../../components/floating-wechat-service.vue'
import {
  WARRANTY_OVERVIEW_URL,
  createWarrantyOverviewController,
  formatWarrantyDate,
  warrantyDetailUrl,
  warrantyPrinciples,
  warrantySteps,
} from '../../utils/warranty-overview'

const STORE_ID = 'store_windoors_demo'
const placeholder = '/static/demo/placeholder.png'

const controller = createWarrantyOverviewController({
  listServices,
  getHome,
  makePhoneCall: phoneNumber => uni.makePhoneCall({ phoneNumber }),
  showToast: title => uni.showToast({ title, icon: 'none' }),
}, STORE_ID)
const overview = reactive(controller.state)
const loadCases = controller.loadCases
const loadPhone = controller.loadPhone
const callWarranty = controller.callWarranty

function scrollToCases() {
  uni.pageScrollTo({ selector: '#active-warranties', duration: 300 })
}

function openCase(id: string) {
  uni.navigateTo({ url: warrantyDetailUrl(id) })
}

onMounted(() => {
  loadCases()
  loadPhone()
})

onShareAppMessage(() => ({ title: '十年质保，让服务有据可查', path: WARRANTY_OVERVIEW_URL }))
onShareTimeline(() => ({ title: '十年质保，让服务有据可查' }))
</script>

<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">WIN DOORS WARRANTY</text>
      <text class="hero-title">十年质保，让服务有据可查</text>
      <text class="hero-copy">安装验收后建立质保凭证，具体期限和范围以项目凭证及双方约定为准。</text>
    </view>

    <view class="panel steps-panel">
      <text class="section-kicker">OUR PROCESS</text>
      <text class="section-title">我们怎么质保</text>
      <view v-for="(step, index) in warrantySteps" :key="step.title" class="step">
        <text class="step-number">0{{ index + 1 }}</text>
        <view class="step-copy"><text>{{ step.title }}</text><text>{{ step.description }}</text></view>
      </view>
    </view>

    <view class="panel">
      <text class="section-kicker">WARRANTY SCOPE</text>
      <text class="section-title">怎么个质保</text>
      <view class="principle-list">
        <view v-for="principle in warrantyPrinciples" :key="principle" class="principle"><text>✓</text><text>{{ principle }}</text></view>
      </view>
    </view>

    <view class="panel apply-panel">
      <text class="section-kicker">GET SUPPORT</text>
      <text class="section-title">如何申请</text>
      <text class="apply-copy">提供质保编号或手机号、问题描述及现场照片，门店核验后安排远程指导、上门检查或维修。</text>
      <button class="primary-button" :loading="overview.phoneStatus === 'loading'" :disabled="overview.phoneStatus === 'loading'" @click="callWarranty">电话咨询质保</button>
      <text v-if="overview.phoneStatus === 'loading'" class="phone-state">正在获取门店电话</text>
      <text v-else-if="overview.phoneStatus === 'empty'" class="phone-state">门店电话暂未配置，请使用微信客服</text>
      <view v-else-if="overview.phoneStatus === 'error'" class="phone-state phone-state--error"><text>门店电话加载失败</text><button class="phone-retry" @click="loadPhone">重试获取电话</button></view>
      <button class="secondary-button" @click="scrollToCases">查看质保中的案例</button>
    </view>

    <view id="active-warranties" class="case-section">
      <view class="case-heading"><text class="section-kicker">ACTIVE WARRANTIES</text><text class="section-title">质保中的案例</text></view>
      <text v-if="overview.caseStatus === 'loading'" class="state-copy">正在加载公开质保案例…</text>
      <text v-else-if="overview.caseStatus === 'empty'" class="state-copy">暂无质保中的公开案例</text>
      <view v-else-if="overview.caseStatus === 'ready'" class="case-grid">
        <button v-for="item in overview.cases" :key="item._id" class="case-card" @click="openCase(item._id)">
          <image :src="item.cover_image || placeholder" mode="aspectFill" />
          <view class="case-body"><text class="case-title">{{ item.title }}</text><text class="case-meta">{{ item.district || item.location }}</text><text class="case-meta">编号 {{ item.warranty_no || '以凭证为准' }}</text><text class="case-meta">到期 {{ formatWarrantyDate(item.warranty_expires_at) }}</text></view>
        </button>
      </view>
      <button v-else class="retry-button" @click="loadCases">重新加载案例</button>
    </view>
    <FloatingWechatService placement="plain" />
  </view>
</template>

<style scoped>
.page { --home-green:#173d34; --home-gold:#ae772d; --home-surface:#ffffff; --home-muted:#66766f; min-height:100vh; padding:30rpx 30rpx calc(120rpx + env(safe-area-inset-bottom)); background:#f4f6f4; }
.hero { padding:52rpx 40rpx 46rpx; border-radius:28rpx; color:#fff; background:linear-gradient(135deg,#173d34,#286353); }
.eyebrow,.section-kicker { display:block; color:var(--home-gold); font-size:20rpx; font-weight:650; letter-spacing:3rpx; }
.hero-title { display:block; margin-top:20rpx; font-size:48rpx; font-weight:650; line-height:1.25; }
.hero-copy,.apply-copy { display:block; margin-top:20rpx; font-size:26rpx; line-height:1.6; }
.hero-copy { color:rgba(255,255,255,.82); }
.panel,.case-section { margin-top:24rpx; padding:34rpx 30rpx; border-radius:28rpx; background:var(--home-surface); }
.section-title { display:block; margin-top:10rpx; color:var(--home-green); font-size:36rpx; font-weight:650; }
.step { display:flex; gap:20rpx; padding:24rpx 0; border-bottom:1rpx solid #edf0ee; }
.step:last-child { border-bottom:0; padding-bottom:0; }
.step-number { display:flex; flex:0 0 58rpx; width:58rpx; height:58rpx; align-items:center; justify-content:center; border-radius:50%; color:var(--home-gold); background:#f7efe1; font-size:21rpx; font-weight:650; }
.step-copy text,.principle text,.case-body text { display:block; }
.step-copy text:first-child { color:#24463c; font-size:28rpx; font-weight:650; }
.step-copy text:last-child,.principle text:last-child { margin-top:8rpx; color:var(--home-muted); font-size:24rpx; line-height:1.6; }
.principle { display:flex; gap:16rpx; padding:22rpx 0; border-bottom:1rpx solid #edf0ee; }
.principle:last-child { border-bottom:0; padding-bottom:0; }
.principle text:first-child { color:var(--home-gold); font-weight:650; }
.apply-copy { color:var(--home-muted); }
.primary-button,.secondary-button,.retry-button,.phone-retry { display:flex; width:100%; min-height:88rpx; margin:20rpx 0 0; padding:0 28rpx; align-items:center; justify-content:center; border-radius:44rpx; font-size:26rpx; line-height:1.6; }
.primary-button { border:0; color:#fff; background:var(--home-green); }
.secondary-button,.retry-button { border:1rpx solid #aac0b8; color:var(--home-green); background:transparent; }
.primary-button::after,.secondary-button::after,.retry-button::after,.case-card::after { border:0; }
.case-heading { margin-bottom:22rpx; }
.case-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18rpx; }
.case-card { width:100%; margin:0; padding:0; overflow:hidden; border:0; border-radius:20rpx; text-align:left; background:#f8faf8; }
.case-card image { width:100%; height:190rpx; background:#e8eeea; }
.case-body { padding:18rpx; }
.case-title { overflow:hidden; color:#24463c; font-size:26rpx; font-weight:650; white-space:nowrap; text-overflow:ellipsis; }
.case-meta { margin-top:8rpx; color:var(--home-muted); font-size:21rpx; line-height:1.45; }
.state-copy { display:block; padding:32rpx 0 8rpx; color:var(--home-muted); text-align:center; font-size:24rpx; line-height:1.6; }
.phone-state { display:block; margin-top:16rpx; color:var(--home-muted); font-size:23rpx; line-height:1.6; }
.phone-state--error { color:#a34831; }
.phone-retry { width:auto; margin:12rpx 0 0; border:1rpx solid #d7a99d; color:#8c3b29; background:transparent; font-size:23rpx; }
.phone-retry::after { border:0; }
</style>
