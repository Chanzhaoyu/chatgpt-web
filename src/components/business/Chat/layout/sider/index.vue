<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import type { HistoryChatProps } from '../../types'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const collapsed = ref(appStore.siderCollapsed ?? false)

const history = ref<HistoryChatProps[]>([])

function handleAdd() {
  history.value.push({
    title: 'New chat',
    edit: false,
    data: [],
  })
}

function handleEdit(index: number) {
  history.value[index].edit = true
}

function handleDelete(index: number) {
  history.value.splice(index, 1)
}

function handleCollapsed() {
  collapsed.value = !collapsed.value
  appStore.setSiderCollapsed(collapsed.value)
}
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    collapse-mode="width"
    show-trigger="arrow-circle"
    bordered
    @update:collapsed="handleCollapsed"
  >
    <div class="flex flex-col h-full">
      <main class="flex-1 min-h-0 overflow-hidden">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            New chat
          </NButton>
        </div>
        <List :data="history" @edit="handleEdit" @delete="handleDelete" />
      </main>
      <Footer />
    </div>
  </NLayoutSider>
</template>
