<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'

const appStore = useAppStore()
const chatStore = useChatStore()

const collapsed = computed(() => appStore.siderCollapsed)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef')
  if (scrollRef)
    nextTick(() => scrollRef.scrollTop = 0)
}

function onScrollToBottom() {
  const scrollRef = document.querySelector('#scrollRef')
  if (scrollRef)
    nextTick(() => scrollRef.scrollTop = scrollRef.scrollHeight)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
  >
    <div class="relative flex items-center justify-between h-14">
      <button
        class="flex items-center justify-center w-11 h-11"
        @click="handleUpdateCollapsed"
      >
        <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
        <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
      </button>
      <h1
        class="flex-1 px-4 overflow-hidden text-center cursor-pointer select-none text-ellipsis whitespace-nowrap"
        @dblclick="onScrollToTop"
      >
        {{ currentChatHistory?.title ?? '' }}
      </h1>
      <button
        class="flex items-center justify-center w-11 h-11"
        @click="onScrollToBottom"
      >
        <SvgIcon class="text-2xl" icon="ri:arrow-down-s-line" />
      </button>
    </div>
  </header>
</template>
