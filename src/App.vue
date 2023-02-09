<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components'
import Chat from '@/views/Chat/index.vue'
</script>

<template>
  <NConfigProvider class="h-full" preflight-style-disabled>
    <NaiveProvider>
      <div class="h-full p-4">
        <Chat />
      </div>
    </NaiveProvider>
  </NConfigProvider>
</template>
