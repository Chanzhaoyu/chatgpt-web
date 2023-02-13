<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NLayout, NLayoutContent, NLayoutSider, NScrollbar } from 'naive-ui'
import { ListItem } from '../components'

const collapsed = ref(false)

function handleCollapsed() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="h-full overflow-hidden border rounded-md shadow-md min-w-[640px]">
    <NLayout class="h-full" has-sider>
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
              <NButton dashed block>
                Add chat
              </NButton>
            </div>
            <NScrollbar class="px-4">
              <div class="flex flex-col gap-2 text-sm">
                <ListItem v-for="(_, index) of 4" :key="index" text="hello world" />
              </div>
            </NScrollbar>
          </main>
          <footer class="py-4 my-2 border-t">
            footer
          </footer>
        </div>
      </NLayoutSider>
      <NLayoutContent class="h-full">
        <slot />
      </NLayoutContent>
    </NLayout>
  </div>
</template>

<style>

</style>
