<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NButton, NInput, NModal, NTabPane, NTabs, useMessage } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { fetchLogin, fetchRegister, fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'

interface Props {
  visible: boolean
}

defineProps<Props>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
const username = ref('')
const password = ref('')

const disabled = computed(() => !username.value.trim() || !password.value.trim() || loading.value)

const activeTab = ref('login')

const showConfirmPassword = ref(false)
const confirmPassword = ref('')

function handlePasswordInput() {
  showConfirmPassword.value = password.value.trim() !== ''
}

const confirmPasswordStatus = computed(() => {
  if (!password.value || !confirmPassword.value)
    return undefined
  return password.value !== confirmPassword.value ? 'error' : 'success'
})

onMounted(async () => {
  const verifytoken = route.query.verifytoken as string
  await handleVerify(verifytoken)
})

async function handleVerify(verifytoken: string) {
  if (!verifytoken)
    return
  const secretKey = verifytoken.trim()

  try {
    loading.value = true
    await fetchVerify(secretKey)
    ms.success('验证成功 | Verify successfully')
    router.replace('/')
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
  }
  finally {
    loading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLogin()
  }
}

async function handleLogin() {
  const name = username.value.trim()
  const pwd = password.value.trim()

  if (!name || !pwd)
    return

  try {
    loading.value = true
    const result = await fetchLogin(name, pwd)
    await authStore.setToken(result.data.token)
    ms.success('success')
    router.go(0)
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    password.value = ''
  }
  finally {
    loading.value = false
  }
}

async function handleRegister() {
  const name = username.value.trim()
  const pwd = password.value.trim()
  const confirmPwd = confirmPassword.value.trim()

  if (!name || !pwd || !confirmPwd || pwd !== confirmPwd) {
    ms.error('两次输入的密码不一致 | Passwords don\'t match')
    return
  }

  try {
    loading.value = true
    const result = await fetchRegister(name, pwd)
    ms.success(result.message as string)
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
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>

        <!-- Add Tabs -->
        <NTabs v-model:value="activeTab" type="line">
          <NTabPane name="login" :tab="$t('common.login')">
            <NInput v-model:value="username" type="text" :placeholder="$t('common.email')" class="mb-2" />
            <NInput v-model:value="password" type="password" :placeholder="$t('common.password')" class="mb-2" @keypress="handlePress" />

            <NButton block type="primary" :disabled="disabled" :loading="loading" @click="handleLogin">
              {{ $t('common.login') }}
            </NButton>
          </NTabPane>

          <NTabPane v-if="authStore.session && authStore.session.allowRegister" name="register" :tab="$t('common.register')">
            <NInput v-model:value="username" type="text" :placeholder="$t('common.email')" class="mb-2" />
            <NInput v-model:value="password" type="password" :placeholder="$t('common.password')" class="mb-2" @input="handlePasswordInput" />
            <NInput
              v-if="showConfirmPassword"
              v-model:value="confirmPassword"
              type="password"
              :placeholder="$t('common.passwordConfirm')"
              class="mb-4"
              :status="confirmPasswordStatus"
            />

            <NButton block type="primary" :disabled="disabled || password !== confirmPassword" :loading="loading" @click="handleRegister">
              {{ $t('common.register') }}
            </NButton>
          </NTabPane>
        </NTabs>
        <!-- End Tabs -->
      </div>
    </div>
  </NModal>
</template>
