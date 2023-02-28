<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'

const router = useRouter()

function toRoot() {
  router.replace({ name: 'Root' })
}
</script>

<template>
  <div class="flex h-screen">
    <div class="m-auto">
      <h1 class="mb-4 text-xl">
        404 Page
      </h1>
      <NButton type="primary" @click="toRoot">
        返回首页
      </NButton>
    </div>
  </div>
</template>
