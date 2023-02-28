<script setup lang='ts'>
import { useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import { useChatStore } from '@/store'

const router = useRouter()
const chatStore = useChatStore()

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all">
    <div class="h-full overflow-hidden dark:border-neutral-800">
      <div class="z-40 flex items-stretch h-full transition" has-sider>
        <Sider />
        <div class="flex-1 h-full overflow-hidden dark:bg-[#313338]">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
