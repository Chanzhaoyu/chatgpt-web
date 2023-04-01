<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import { useAuthStore } from '@/store'
const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))

const authStore = useAuthStore()

const show = ref(false)

async function handleLogout() {
  await authStore.removeToken()
}
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden">
      <UserAvatar />
    </div>
    <HoverButton v-if="!!authStore.token" :tooltip="$t('common.logOut')" @click="handleLogout">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="uil:exit" />
      </span>
    </HoverButton>

    <HoverButton :tooltip="$t('setting.setting')" @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <Setting v-if="show" v-model:visible="show" />
  </footer>
</template>
