<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import md5 from 'md5'
import { login } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'
import { router } from '@/router'
const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
const mobile = ref('')
const password = ref('')

const disabled = computed(() => !mobile.value.trim() || !password.value.trim() || loading.value)

async function handleVerify() {
  const vm = mobile.value.trim()
  const vp = md5(password.value.trim())

  if (!vm || !vp)
    return

  try {
    loading.value = true
    const userRes = await login<UserInfo>(vm, vp)
    authStore.user = userRes.data
    authStore.setToken(userRes.data.token)
    ms.success('success')
    router.replace('/chat')
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex h-full justify-center bg-white  dark:bg-slate-800">
    <div class="p-10 rounded">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            登录
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <NInput v-model:value="mobile" type="text" placeholder="请输入手机号" />
        <NInput v-model:value="password" type="password" placeholder="请输入密码" />
        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
