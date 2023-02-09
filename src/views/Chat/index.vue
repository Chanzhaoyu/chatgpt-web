<script setup lang='ts'>
import { NButton, NInput, NScrollbar } from 'naive-ui'
import Message from './components/Message.vue'
import { SvgIcon } from '@/components'
</script>

<template>
  <div class="h-full p-4">
    <div class="flex flex-col h-full overflow-hidden border rounded-md shadow-md">
      <header class="flex items-center justify-between p-4">
        <div>会话</div>
        <div>&nbsp;</div>
      </header>
      <main class="flex-1 overflow-hidden border-y">
        <div class="h-full">
          <NScrollbar class="h-full p-4">
            <div>
              <Message date="10 hours ago" message="hello world" />
              <Message date="10 hours ago" message="Reprehenderit ut voluptas sapiente ratione nostrum est." user />
              <Message date="10 hours ago" message="hello world" />
              <Message date="10 hours ago" message="Reprehenderit ut voluptas sapiente ratione nostrum est." user />
              <Message date="10 hours ago" message="hello world" />
              <Message date="10 hours ago" message="Reprehenderit ut voluptas sapiente ratione nostrum est." user />
              <Message date="10 hours ago" message="hello world" />
              <Message date="10 hours ago" message="Reprehenderit ut voluptas sapiente ratione nostrum est." user />
              <Message date="10 hours ago" message="hello world" />
              <Message date="10 hours ago" message="Reprehenderit ut voluptas sapiente ratione nostrum est." user />
            </div>
          </NScrollbar>
        </div>
      </main>
      <footer class="p-4">
        <div class="flex items-center justify-between space-x-2">
          <NInput placeholder="Type a message" />
          <NButton type="primary">
            <SvgIcon icon="ri:send-plane-fill" />
          </NButton>
        </div>
      </footer>
    </div>
  </div>
</template>
