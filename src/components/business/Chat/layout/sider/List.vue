<script setup lang='ts'>
import { NScrollbar } from 'naive-ui'
import ListItem from './ListItem.vue'
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <ListItem text="Learning correlation" />
      <ListItem text="Write Code" />
      <ListItem text="docs..." />
    </div>
  </NScrollbar>
</template>
