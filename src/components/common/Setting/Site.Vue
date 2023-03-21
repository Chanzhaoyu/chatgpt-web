<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NSpin, useMessage } from 'naive-ui'
import { fetchChatConfig, fetchUpdateSite } from '@/api'
import { ConfigState, SiteConfig } from './model'
import { t } from '@/locales'

const ms = useMessage()

const loading = ref(false)

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
    if(!site){
        return
    }
    const { data } = await fetchUpdateSite(site)
    config.value = data
    ms.success(t('common.success'))
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
                        <NInput :value="config && config.siteTitle" placeholder="" @input="(val) => { if (config) config.siteTitle = val }" />
                    </div>
                </div>
                    <div class="flex items-center space-x-4">
                        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.siteDomain') }}</span>
                        <div class="flex-1">
                            <NInput :value="config && config.siteDomain" placeholder="" @input="(val) => { if (config) config.siteDomain = val }" />
                        </div>
                    </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.registerEnabled') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.registerEnabled !== undefined ? String(config.registerEnabled) : undefined" placeholder="" @input="(val) => { if (config) config.registerEnabled = typeof val === 'string' ? Boolean(val) : undefined }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.registerMails') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.registerMails" placeholder="" @input="(val) => { if (config) config.registerMails = val }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]"></span>
                    <NButton type="primary" @click="updateSiteInfo(config)">
                        {{ $t('common.save') }}
                    </NButton>
                </div>
            </div>
        </div>
    </NSpin>
</template>
