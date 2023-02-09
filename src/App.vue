<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components'
import Chat from '@/views/Chat/index.vue'
</script>

<template>
  <NConfigProvider class="h-full" preflight-style-disabled>
    <NaiveProvider>
      <div class="h-full overflow-hidden">
        <div class="h-full pb-[50px] p-4">
          <Chat />
        </div>
        <div class="fixed bottom-0 left-0 right-0 p-4 text-sm text-center text-neutral-500">
          <span class="text-center">
            ❤️ Made By ChenZhaoYu -
            <a href="https://github.com/Chanzhaoyu/chatgpt-bot" target="_blank" class="text-blue-500">
              Github
            </a>
          </span>
        </div>
      </div>
    </NaiveProvider>
  </NConfigProvider>
</template>
