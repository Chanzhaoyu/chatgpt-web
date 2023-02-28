<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'

const router = useRouter()

function handleLogin() {
  router.push({ name: 'Root' })
}
</script>

<template>
  <div class="flex h-screen">
    <div class="m-auto">
      <h1 class="mb-4 text-xl">
        Login Page
      </h1>
      <NButton type="primary" @click="handleLogin">
        登录
      </NButton>
    </div>
  </div>
</template>

<style>

</style>
