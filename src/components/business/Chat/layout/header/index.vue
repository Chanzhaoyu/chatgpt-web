<script lang="ts" setup>
import { computed } from 'vue'
import { SvgIcon } from '@/components/common'
import { useAppStore, useHistoryStore } from '@/store'

const appStore = useAppStore()
const historyStore = useHistoryStore()

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
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur">
    <div class="relative flex items-center justify-between px-4 h-14">
      <button class="flex items-center justify-center w-11 h-11" @click="handleUpdateCollapsed">
        <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
        <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
      </button>
      <button class="flex items-center justify-center w-11 h-11" @click="handleAdd">
        <SvgIcon class="text-2xl" icon="ri:add-fill" />
      </button>
    </div>
  </header>
</template>
