<script setup lang='ts'>
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
</script>

<template>
  <div class="h-full overflow-hidden border rounded-md shadow-md">
    <NLayout class="h-full" has-sider>
      <NLayoutSider
        collapse-mode="width"
        :collapsed-width="120"
        :width="240"
        show-trigger="arrow-circle"
        class="p-4"
        bordered
      >
        <span>Sider</span>
      </NLayoutSider>
      <NLayoutContent class="h-full">
        <slot />
      </NLayoutContent>
    </NLayout>
  </div>
</template>

<style>

</style>
