<script setup lang="ts">
import { NaiveProvider } from '@/components/common'
import Chat from '@/views/Chat/index.vue'
</script>

<template>
  <NaiveProvider>
    <div class="h-full p-4 overflow-hidden">
      <Chat />
    </div>
  </NaiveProvider>
</template>
