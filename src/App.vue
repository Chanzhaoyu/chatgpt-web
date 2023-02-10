<script setup lang="ts">
import { GithubSite, NaiveProvider } from '@/components'
import Chat from '@/views/Chat/index.vue'
</script>

<template>
  <NaiveProvider>
    <div class="h-full overflow-hidden pb-[50px] p-4">
      <Chat />
      <GithubSite />
    </div>
  </NaiveProvider>
</template>
