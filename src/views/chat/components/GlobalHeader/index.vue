<script lang="ts" setup>
import { NButton, NSpace } from 'naive-ui'
import { useRouter } from 'vue-router'
import { ROUTER } from '@/router/const'

const router = useRouter()

const jumpToChat = () => {
  router.push({
    name: ROUTER.name.root,
  })
}

const jumpToModel = () => {
  router.push({
    name: ROUTER.name.model,
  })
}
</script>

<template>
  <div class="global-header">
    <NSpace>
      <NButton @click="jumpToChat">
        Chat
      </NButton>
      <NButton @click="jumpToModel">
        微调
      </NButton>
    </NSpace>
  </div>
</template>

<style lang="less" scoped>
.global-header {
    padding: 4px;
}
</style>
