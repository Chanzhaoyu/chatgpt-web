<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NSpin, useMessage } from 'naive-ui'
import { ConfigState } from './model'
import { fetchChatConfig, fetchUpdateBaseSetting } from '@/api'
import { t } from '@/locales'

const ms = useMessage()

const loading = ref(false)
const saving = ref(false)

const config = ref(new ConfigState())

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
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.apiBaseUrl') }}</span>
          <div class="flex-1">
            <NInput :value="config.apiBaseUrl" placeholder="https://api.openai.com, Only used by ChatGPTAPI" @input="(val) => { config.apiBaseUrl = val }" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.reverseProxy') }}</span>
          <div class="flex-1">
            <NInput :value="config.reverseProxy" placeholder="Only used by ChatGPTUnofficialProxyAPI" @input="(val) => { config.reverseProxy = val }" />
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
