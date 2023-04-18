<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NAvatar, NButton } from 'naive-ui'
import { useAuthStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import Permission from '@/views/chat/layout/Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const userStore = useUserStore()
const authStore = useAuthStore()
const needPermission = ref(false)

const { isMobile } = useBasicLayout()
if (!!authStore.session?.auth && !authStore.token)
  needPermission.value = isMobile.value

const userInfo = computed(() => userStore.userInfo)
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 v-if="userInfo.name" class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.name }}
      </h2>
      <NButton
        v-else tag="a" text
        @click="needPermission = true"
      >
        <span class="text-xl text-[#ff69b4] dark:text-white">
          {{ $t('common.notLoggedIn') }}
        </span>
      </NButton>
    </div>
    <Permission :visible="needPermission" />
  </div>
</template>
