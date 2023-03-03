<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'

const router = useRouter()

const authStore = useAuthStore()

const ms = useMessage()

const token = ref('')
const loading = ref(false)

async function handleVerify() {
  const secretKey = token.value.trim()

  if (!secretKey)
    return

  try {
    loading.value = true
    await fetchVerify(secretKey)
    authStore.setToken(secretKey)
    ms.success('success')
    router.replace('/')
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
    token.value = ''
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex h-full dark:bg-neutral-800">
    <div class="px-4 m-auto space-y-4 text-center w-[500px]">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-neutral-200">
        403
      </h1>
      <p class="text-base text-slate-500 dark:text-slate-500">
        Please Enter the Secret Key!
      </p>
      <div>
        <NInput v-model:value="token" type="text" placeholder="" />
      </div>
      <NButton type="primary" :loading="loading" @click="handleVerify">
        verify
      </NButton>
    </div>
  </div>
</template>
