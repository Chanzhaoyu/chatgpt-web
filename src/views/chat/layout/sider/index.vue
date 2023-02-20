<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
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
    :style="getMobileClass"
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
      <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t">
        <UserAvatar />
        <HoverButton tooltip="Setting">
          <span class="text-xl text-[#4f555e]">
            <SvgIcon icon="ri:settings-4-line" />
          </span>
        </HoverButton>
      </footer>
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 bg-black/40" @click="handleUpdateCollapsed" />
  </template>
</template>
