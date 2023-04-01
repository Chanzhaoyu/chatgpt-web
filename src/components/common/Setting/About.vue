<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NButton, NInput, NSpin, useMessage } from 'naive-ui'
import { ConfigState } from './model'
import { fetchChatConfig, fetchUpdateBaseSetting } from '@/api'
import { useAuthStore } from '@/store'
import { t } from '@/locales'

const ms = useMessage()

const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)

const config = ref<ConfigState>()
config.value = new ConfigState()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

async function updateBaseSetting(baseConfig?: Partial<ConfigState>) {
  if (!baseConfig)
    return
  saving.value = true
  try {
    const { data } = await fetchUpdateBaseSetting(baseConfig)
    config.value = data
    ms.success(t('common.success'))
  }
  catch (error: any) {
    ms.error(error.message)
  }
  saving.value = false
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.api') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.apiKey" placeholder="" @input="(val) => { if (config) config.apiKey = val }" />
          </div>
          <p v-if="isChatGPTAPI">
            {{ $t("setting.balance") }}：{{ config?.balance ?? '-' }}
          </p>
        </div>
        <div v-if="isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.apiBaseUrl') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.apiBaseUrl" placeholder="https://api.openai.com" @input="(val) => { if (config) config.apiBaseUrl = val }" />
          </div>
        </div>
        <div v-if="isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.apiModel') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.apiModel" placeholder="" @input="(val) => { if (config) config.apiModel = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.accessToken') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.accessToken" placeholder="" @input="(val) => { if (config) config.accessToken = val }" />
          </div>
        </div>
        <div v-if="!isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.reverseProxy') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.reverseProxy" placeholder="" @input="(val) => { if (config) config.reverseProxy = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.timeout') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.timeoutMs !== undefined ? String(config.timeoutMs) : undefined" placeholder="" @input="(val) => { if (config) config.timeoutMs = typeof val === 'string' ? Number(val) : undefined }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.socks') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.socksProxy" placeholder="" @input="(val) => { if (config) config.socksProxy = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.socksAuth') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.socksAuth" placeholder="name:pasword" @input="(val) => { if (config) config.socksAuth = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.httpsProxy') }}</span>
          <div class="flex-1">
            <NInput :value="config && config.httpsProxy" placeholder="" @input="(val) => { if (config) config.httpsProxy = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]" />
          <NButton :loading="saving" type="primary" @click="updateBaseSetting(config)">
            {{ $t('common.save') }}
          </NButton>
        </div>
      </div>
    </div>
  </NSpin>
</template>
