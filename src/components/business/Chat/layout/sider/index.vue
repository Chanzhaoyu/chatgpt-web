<script setup lang='ts'>
import { computed, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import { useAppStore, useHistoryStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const appStore = useAppStore()
const historyStore = useHistoryStore()
const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  historyStore.addHistory({
    title: 'New Chat',
    isEdit: false,
    data: [],
  })
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  { flush: 'post' },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :class="[{ 'pt-14': isMobile }]">
      <main class="flex-1 min-h-0 overflow-hidden">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            New chat
          </NButton>
        </div>
        <List />
      </main>
      <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t h-[70px]">
        <UserAvatar />
        <HoverButton tooltip="Setting">
          <span class="text-xl text-[#4f555e]">
            <SvgIcon icon="ri:settings-4-line" />
          </span>
        </HoverButton>
      </footer>
    </div>
  </NLayoutSider>
</template>
