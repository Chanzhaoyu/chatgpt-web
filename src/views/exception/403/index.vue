<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <h1 class="text-4xl text-slate-800 dark:text-neutral-200">
        No permission
      </h1>
      <p class="text-base text-slate-500 dark:text-neutral-400">
        The page you're trying access has restricted access.
        Please refer to your system administrator
      </p>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px]">
          <div class="w-[300px]">
            <img src="../../../icons/403.svg" alt="404">
          </div>
        </div>
      </div>
      <NButton type="primary" @click="goHome">
        Go to Home
      </NButton>
    </div>
  </div>
</template>
