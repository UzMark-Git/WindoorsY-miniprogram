<script setup lang="ts">
import { ref } from 'vue'
import type { StaffProfile } from '../../types/domain'

const props = defineProps<{ items: StaffProfile[]; placeholder: string }>()
const emit = defineEmits<{ select: [id: string] }>()
const failedAvatars = ref<Record<string, boolean>>({})

function avatarSource(person: StaffProfile) {
  return failedAvatars.value[person._id] ? props.placeholder : (person.avatar || props.placeholder)
}
</script>

<template>
  <scroll-view scroll-x :show-scrollbar="false" class="staff-scroll">
    <view class="staff-row">
      <button
        v-for="person in props.items.slice(0,5)"
        :key="person._id"
        class="staff-card"
        :aria-label="`查看${person.name}的人员详情`"
        @click="emit('select', person._id)"
      >
        <image :src="avatarSource(person)" mode="aspectFill" :aria-label="`${person.name}头像`" @error="failedAvatars[person._id] = true" />
        <view class="staff-copy">
          <text class="staff-name">{{ person.name }}</text>
          <text class="staff-role">{{ person.role }}</text>
        </view>
      </button>
    </view>
  </scroll-view>
</template>

<style scoped>
.staff-scroll { width: 100%; white-space: nowrap; }
.staff-row { display: flex; gap: 18rpx; }
.staff-card { flex: 0 0 40%; display: flex; align-items: center; gap: 18rpx; min-width: 88rpx; min-height: 88rpx; margin: 0; padding: 18rpx; border: 0; border-radius: 18rpx; color: #203832; text-align: left; line-height: normal; white-space: normal; background: #fff; }
.staff-card::after { border: 0; }
.staff-card image { flex: 0 0 auto; width: 84rpx; height: 84rpx; border-radius: 50%; background: #e6edeb; }
.staff-copy { min-width: 0; }
.staff-name, .staff-role { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.staff-name { font-size: 27rpx; font-weight: 600; }
.staff-role { margin-top: 8rpx; color: #7d8985; font-size: 21rpx; }
</style>
