<script setup lang="ts">
import type { LegalDocument } from '../config/legal'
import { LEGAL_PROFILE } from '../config/legal'

defineProps<{ document: LegalDocument }>()
</script>

<template>
  <view class="legal-document">
    <text class="title">{{ document.title }}</text>
    <text class="meta">版本 {{ LEGAL_PROFILE.version }} · 生效日期 {{ LEGAL_PROFILE.effectiveDate }}</text>
    <view v-for="section in document.sections" :key="section.title" class="section">
      <text class="heading">{{ section.title }}</text>
      <text v-for="paragraph in section.paragraphs" :key="paragraph" class="paragraph">{{ paragraph }}</text>
    </view>
  </view>
</template>

<style scoped>
.legal-document { min-height: 100vh; padding: 40rpx 32rpx 80rpx; box-sizing: border-box; background: #f7f8f7; color: #24332f; }
.title { display: block; font-size: 44rpx; font-weight: 650; }
.meta { display: block; margin-top: 14rpx; color: #7a8581; font-size: 24rpx; }
.section { margin-top: 42rpx; }
.heading { display: block; font-size: 31rpx; font-weight: 600; }
.paragraph { display: block; margin-top: 18rpx; color: #4a5753; font-size: 28rpx; line-height: 1.85; }
</style>
