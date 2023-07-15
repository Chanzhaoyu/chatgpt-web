<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NAvatar, NButton, NTag } from 'naive-ui'
import { useRoute } from 'vue-router'
import { UserRole } from '../Setting/model'
import { useAuthStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import Permission from '@/views/chat/layout/Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()
const { isMobile } = useBasicLayout()
const showPermission = ref(false)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token && (isMobile.value || showPermission.value))

const userInfo = computed(() => userStore.userInfo)

onMounted(async () => {
  const sign = route.query.verifyresetpassword as string
  if (sign)
    showPermission.value = true
})
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
      <h2 v-if="userInfo.name" class="">
        {{ userInfo.name }}
        <NTag v-if="userInfo.roles.length > 0" size="small" :bordered="false" type="success">
          {{ UserRole[userInfo.roles[0]] }}
        </NTag>
      </h2>
      <p v-if="userInfo.name" class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userInfo.description) && userInfo.description !== ''"
          v-html="userInfo.description"
        />
      </p>
      <NButton
        v-else tag="a" text
        @click="showPermission = true"
      >
        <span v-if="!!authStore.session?.auth && !authStore.token" class="text-xl text-[#ff69b4] dark:text-white">
          {{ $t('common.notLoggedIn') }}
        </span>
        <span v-else class="text-xl text-[#ff69b4] dark:text-white">
          {{ authStore .session?.title }}
        </span>
      </NButton>
    </div>
    <Permission :visible="needPermission" @update:visible="(newValue) => showPermission = newValue" />
  </div>
</template>
