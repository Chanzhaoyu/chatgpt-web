<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { NButton, NInput, NSelect, NSpin, NTag, useMessage } from 'naive-ui'
import { ConfigState } from './model'
import { fetchChatConfig, fetchUpdateBaseSetting } from '@/api'
import { t } from '@/locales'

const ms = useMessage()

const loading = ref(false)
const saving = ref(false)

const config = ref(new ConfigState())

const apiModelOptions = ['ChatGPTAPI', 'ChatGPTUnofficialProxyAPI'].map((model: string) => {
  return {
    label: model,
    key: model,
    value: model,
  }
})

let isChatGPTAPI = config.value.apiModel === 'ChatGPTAPI'

watch(
  () => config.value.apiModel,
  (newVal, oldVal) => {
    isChatGPTAPI = newVal === 'ChatGPTAPI'
  },
)

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
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.apiModel') }}</span>
          <div class="flex-1">
            <NSelect
              style="width: 240px"
              :value="config.apiModel"
              :options="apiModelOptions"
              @update-value="(val) => { config.apiModel = val }"
            />
          </div>
        </div>
        <div v-if="isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.api') }}</span>
          <div class="flex-1">
            <NInput :value="config.apiKey" placeholder="" @input="(val) => { config.apiKey = val }" />
          </div>
          <p>
            {{ $t("setting.balance") }}：{{ config.balance }}
          </p>
        </div>
        <div v-if="isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.apiBaseUrl') }}</span>
          <div class="flex-1">
            <NInput :value="config.apiBaseUrl" placeholder="https://api.openai.com" @input="(val) => { config.apiBaseUrl = val }" />
          </div>
        </div>
        <div v-if="!isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.accessToken') }}</span>
          <div class="flex-1">
            <NInput :value="config.accessToken" placeholder="" @input="(val) => { config.accessToken = val }" />
          </div>
        </div>
        <div v-if="!isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.accessTokenExpiredTime') }}</span>
          <div class="flex-1">
            {{ config.accessTokenExpiredTime }}
            <NTag v-if="config.accessTokenExpiredTime && config.accessTokenExpiredTime !== '-' && new Date(config.accessTokenExpiredTime as string) < new Date()" :bordered="false" type="warning">
              {{ new Date(config.accessTokenExpiredTime as string) > new Date() ? '' : 'Expired' }}
            </NTag>
          </div>
          <p>
            <a target="_blank" href="https://chat.openai.com/api/auth/session">Goto Refresh Token</a>
          </p>
        </div>
        <div v-if="!isChatGPTAPI" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.reverseProxy') }}</span>
          <div class="flex-1">
            <NInput :value="config.reverseProxy" placeholder="" @input="(val) => { config.reverseProxy = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.timeout') }}</span>
          <div class="flex-1">
            <NInput :value="config.timeoutMs !== undefined ? String(config.timeoutMs) : undefined" placeholder="" @input="(val) => { config.timeoutMs = typeof val === 'string' ? Number(val) : undefined }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.socks') }}</span>
          <div class="flex-1">
            <NInput :value="config.socksProxy" placeholder="" @input="(val) => { config.socksProxy = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.socksAuth') }}</span>
          <div class="flex-1">
            <NInput :value="config.socksAuth" placeholder="name:pasword" @input="(val) => { config.socksAuth = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.httpsProxy') }}</span>
          <div class="flex-1">
            <NInput :value="config.httpsProxy" placeholder="" @input="(val) => { config.httpsProxy = val }" />
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
