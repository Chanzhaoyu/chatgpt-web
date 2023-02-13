<script setup lang='ts'>
import { NScrollbar } from 'naive-ui'
import ListItem from './ListItem.vue'
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <ListItem v-for="(_, index) of 4" :key="index" text="hello world" />
    </div>
  </NScrollbar>
</template>
