<script setup lang="ts">
import { NConfigProvider, dateZhCN, zhCN } from 'naive-ui'
import NaiveProvider from '@/components/NaiveProvider.vue'
import Chat from '@/views/Chat/index.vue'
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" class="h-full" preflight-style-disabled>
    <NaiveProvider>
      <div class="h-full p-4">
        <Chat />
      </div>
    </NaiveProvider>
  </NConfigProvider>
</template>
