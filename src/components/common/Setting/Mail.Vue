<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NSpin, useMessage } from 'naive-ui'
import { fetchChatConfig , fetchUpdateMail } from '@/api'
import { ConfigState, MailConfig } from './model'
import { t } from '@/locales'

const ms = useMessage()

const loading = ref(false)

const config = ref<MailConfig>();

async function fetchConfig() {
    try {
        loading.value = true
        const { data } = await fetchChatConfig<ConfigState>()
        config.value = data.mailConfig
    }
    finally {
        loading.value = false
    }
}

async function updateMailInfo(mail?: MailConfig) {
    if(!mail){
        return
    }
    const { data } =  await fetchUpdateMail(mail)
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
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.smtpHost') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.smtpHost" placeholder="" @input="(val) => { if (config) config.smtpHost = val }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.smtpPort') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.smtpPort !== undefined ? String(config.smtpPort) : undefined" placeholder="" @input="(val) => { if (config) config.smtpPort = typeof val === 'string' ? Number(val) : undefined }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.smtpTsl') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.smtpTsl !== undefined ? String(config.smtpTsl) : undefined" placeholder="" @input="(val) => { if (config) config.smtpTsl = typeof val === 'string' ? Boolean(val) : undefined }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.smtpUserName') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.smtpUserName" placeholder="" @input="(val) => { if (config) config.smtpUserName = val }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]">{{ $t('setting.smtpPassword') }}</span>
                    <div class="flex-1">
                        <NInput :value="config && config.smtpPassword" placeholder="" @input="(val) => { if (config) config.smtpPassword = val }" />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="flex-shrink-0 w-[100px]"></span>
                    <NButton type="primary" @click="updateMailInfo(config)">
                        {{ $t('common.save') }}
                    </NButton>
                </div>
            </div>
        </div>
    </NSpin>
</template>
