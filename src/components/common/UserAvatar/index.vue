<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useAuthStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'

const userStore = useAuthStore()

const user = computed(() => userStore.user)
const avatar = computed(() => `https://skydrive-qyt.oss-cn-hangzhou.aliyuncs.com/pics/${user.value?.avatar}?x-oss-process=image/resize,m_lfit,h_144,w_144`)
</script>

<template>
  <div class="flex items-center">
    <div class="w-10 h-10 overflow-hidden rounded-full">
      <template v-if="isString(user?.avatar) && user.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="ml-2">
      <h2 class="font-bold text-md">
        {{ user?.name ?? 'QYT' }}
      </h2>
      <!-- <p class="text-xs text-gray-500">
        <span
          v-if="isString(userInfo.description) && userInfo.description !== ''"
          v-html="userInfo.description"
        />
      </p> -->
    </div>
  </div>
</template>
