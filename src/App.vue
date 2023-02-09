<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components'
import Chat from '@/views/Chat/index.vue'
</script>

<template>
  <NConfigProvider class="h-full" preflight-style-disabled>
    <NaiveProvider>
      <div class="flex flex-col h-full p-4">
        <div class="flex-1">
          <div class="container h-full m-auto">
            <Chat />
          </div>
        </div>
        <div class="px-4 mt-4 text-sm text-center text-neutral-500">
          Made By ChenZhaoYu
          <a href="https://github.com/Chanzhaoyu/chatgpt-bot" target="_blank" class="text-blue-500">
            Github
          </a>
        </div>
      </div>
    </NaiveProvider>
  </NConfigProvider>
</template>
