<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NSelect, NSpin, NSwitch, useMessage } from 'naive-ui'
import type { AuditConfig, ConfigState } from './model'
import { TextAuditServiceProvider } from './model'
import { fetchChatConfig, fetchTestAudit, fetchUpdateAudit } from '@/api'
import { t } from '@/locales'

const ms = useMessage()

const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const testText = ref<string>()

const serviceOptions: { label: string; key: TextAuditServiceProvider; value: TextAuditServiceProvider }[] = [
  { label: '百度云', key: 'baidu', value: 'baidu' },
]

const config = ref<AuditConfig>()

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data.auditConfig
  }
  finally {
    loading.value = false
  }
}

async function updateAuditInfo() {
  saving.value = true
  try {
    const { data } = await fetchUpdateAudit(config.value as AuditConfig)
    config.value = data
    ms.success(t('common.success'))
  }
  catch (error: any) {
    ms.error(error.message)
  }
  saving.value = false
}

async function testAudit() {
  testing.value = true
  try {
    const { message } = await fetchTestAudit(testText.value as string, config.value as AuditConfig) as { status: string; message: string }
    ms.success(message)
  }
  catch (error: any) {
    ms.error(error.message)
  }
  testing.value = false
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
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditCustomizeEnabled') }}</span>
          <div class="flex-1">
            <NSwitch
              :round="false" :value="config && config.customizeEnabled"
              @update:value="(val) => { if (config) config.customizeEnabled = val }"
            />
          </div>
        </div>
        <div v-if="config && config.customizeEnabled" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditCustomizeWords') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.sensitiveWords"
              placeholder="一行一个敏感词 | One word per line"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4 }"
              @input="(val) => { if (config) config.sensitiveWords = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditEnabled') }}</span>
          <div class="flex-1">
            <NSwitch
              :round="false" :value="config && config.enabled"
              @update:value="(val) => { if (config) config.enabled = val }"
            />
          </div>
        </div>
        <div v-if="config && config.enabled" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditProvider') }}</span>
          <div class="flex-1">
            <NSelect
              style="width: 140px"
              :value="config && config.provider"
              :options="serviceOptions"
              @update-value="(val) => { if (config) config.provider = val as TextAuditServiceProvider }"
            />
          </div>
        </div>
        <div v-if="config && config.enabled" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditApiKey') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.options && config.options.apiKey"
              placeholder=""
              @input="(val) => { if (config && config.options) config.options.apiKey = val }"
            />
          </div>
        </div>
        <div v-if="config && config.enabled" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditApiSecret') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.options && config.options.apiSecret"
              placeholder=""
              @input="(val) => { if (config && config.options) config.options.apiSecret = val }"
            />
          </div>
        </div>
        <div v-if="config && config.enabled" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditBaiduLabel') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.options && config.options.label"
              :placeholder="$t('setting.auditBaiduLabelTip')"
              @input="(val) => { if (config && config.options) config.options.label = val }"
            />
          </div>
          <p v-if="config && config.provider === 'baidu'">
            <a target="_blank" href="https://ai.baidu.com/ai-doc/ANTIPORN/Nk3h6xbb2#%E7%BB%86%E5%88%86%E6%A0%87%E7%AD%BE%E5%AF%B9%E7%85%A7%E8%A1%A8">{{ $t('setting.auditBaiduLabelLink') }}</a>
          </p>
        </div>
        <div v-if="config && (config.enabled || config.customizeEnabled)" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.auditTest') }}</span>
          <div class="flex-1">
            <NInput
              v-model:value="testText"
              placeholder=""
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]" />
          <div class="flex flex-wrap items-center gap-4">
            <NButton :loading="saving" type="primary" @click="updateAuditInfo()">
              {{ $t('common.save') }}
            </NButton>
            <NButton :loading="testing" type="info" @click="testAudit()">
              {{ $t('common.test') }}
            </NButton>
            <p class="text-xs text-[#b4bbc4] text-left">
              {{ $t('common.auditTip') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </NSpin>
</template>
