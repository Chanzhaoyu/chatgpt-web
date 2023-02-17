<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import Sider from './sider/index.vue'
import Header from './header/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pt-14': isMobile.value },
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})
</script>

<template>
  <div class="h-screen p-4" :class="[{ 'p-0': isMobile }]">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <Header v-if="isMobile" />
        <NLayoutContent class="h-full">
          <slot />
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>
