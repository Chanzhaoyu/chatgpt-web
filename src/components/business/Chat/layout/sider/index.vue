<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NLayoutSider, useMessage } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const ms = useMessage()

const collapsed = ref(appStore.siderCollapsed ?? false)

function handleAdd() {
  ms.info('Coming soon...')
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
        <List />
      </main>
      <Footer />
    </div>
  </NLayoutSider>
</template>
