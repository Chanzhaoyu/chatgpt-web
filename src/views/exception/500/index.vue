<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full dark:bg-neutral-800">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <h1 class="text-4xl text-slate-800 dark:text-slate-800">
        502
      </h1>
      <p class="text-base text-slate-500 dark:text-slate-500">
        Server error
      </p>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px]">
          <div class="w-[300px]">
            <img src="../../../icons/500.svg" alt="500">
          </div>
        </div>
      </div>
      <NButton type="primary" @click="goHome">
        Go to Home
      </NButton>
    </div>
  </div>
</template>
