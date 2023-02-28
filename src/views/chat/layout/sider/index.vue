<script setup lang='ts'>
import { watch } from 'vue'
import { NButton } from 'naive-ui'
import List from './List.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
}

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
  <div class="h-full w-[260px] bg-[#eeeff1] dark:bg-[#2b2d31]">
    <div class="flex flex-col h-full">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton type="primary" dashed block @click="handleAdd">
            New chat
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
      </main>
    </div>
  </div>
</template>
