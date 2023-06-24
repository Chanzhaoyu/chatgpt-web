<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NSpin, NSwitch, useMessage } from 'naive-ui'
import type { ConfigState } from './model'
import { SiteConfig } from './model'
import { fetchChatConfig, fetchUpdateSite } from '@/api'
import { t } from '@/locales'

const ms = useMessage()

const loading = ref(false)
const saving = ref(false)

const config = ref<SiteConfig>()
config.value = new SiteConfig()

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data.siteConfig
  }
  finally {
    loading.value = false
  }
}

async function updateSiteInfo(site?: SiteConfig) {
  if (!site)
    return

  saving.value = true
  try {
    const { data } = await fetchUpdateSite(site)
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
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.siteTitle') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.siteTitle" placeholder=""
              @input="(val) => { if (config) config.siteTitle = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.siteDomain') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.siteDomain" placeholder=""
              @input="(val) => { if (config) config.siteDomain = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.loginEnabled') }}</span>
          <div class="flex-1">
            <NSwitch
              :round="false"
              :disabled="config && config.loginEnabled"
              :value="config && config.loginEnabled"
              @update:value="(val) => { if (config) config.loginEnabled = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.loginSalt') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.loginSalt" :placeholder="$t('setting.loginSaltTip')"
              @input="(val) => { if (config) config.loginSalt = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.registerEnabled') }}</span>
          <div class="flex-1">
            <NSwitch
              :round="false"
              :value="config && config.registerEnabled"
              @update:value="(val) => { if (config) config.registerEnabled = val }"
            />
          </div>
        </div>
        <div v-show="config && config.registerEnabled" class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.registerReview') }}</span>
          <div class="flex-1">
            <NSwitch
              :round="false"
              :value="config && config.registerReview"
              @update:value="(val) => { if (config) config.registerReview = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.registerMails') }}</span>
          <div class="flex-1">
            <NInput
              :value="config && config.registerMails" :placeholder="$t('setting.registerReviewTip')"
              @input="(val) => { if (config) config.registerMails = val }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]" />
          <NButton :loading="saving" type="primary" @click="updateSiteInfo(config)">
            {{ $t('common.save') }}
          </NButton>
        </div>
      </div>
    </div>
  </NSpin>
</template>
