<script setup lang='ts'>
import { NLayout, NLayoutContent } from 'naive-ui'
import Sider from './sider/index.vue'
</script>

<template>
  <div class="h-full overflow-hidden border rounded-md shadow-md">
    <NLayout class="h-full" has-sider>
      <Sider />
      <NLayoutContent class="h-full">
        <slot />
      </NLayoutContent>
    </NLayout>
  </div>
</template>
