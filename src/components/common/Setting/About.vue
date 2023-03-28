<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import { fetchChatConfig } from '@/api'
import pkg from '@/../package.json'

interface ConfigState {
  expireTime?: string
}

// eslint-disable-next-line unused-imports/no-unused-vars
// const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

// eslint-disable-next-line unused-imports/no-unused-vars
// const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  catch (error: any) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        Version - {{ pkg.version }}
      </h2>
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p>
          此项目授权续费地址
          <a
            class="text-blue-600 dark:text-blue-500"
            href="http://acc.bigcatrun.com"
            target="_blank"
          >
            Github
          </a>
          ，bigcatrun
        </p>
      </div>
			<p>{{ $t("setting.expireTime") }}：{{ config?.expireTime ?? '-' }}</p>
		</div>
  </NSpin>
</template>
