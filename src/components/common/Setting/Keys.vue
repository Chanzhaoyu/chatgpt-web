<script lang="ts" setup>
import { h, onMounted, reactive, ref } from 'vue'
import { NButton, NDataTable, NInput, NModal, NSelect, NSpace, NSwitch, NTag, useDialog, useMessage } from 'naive-ui'
import type { CHATMODEL } from './model'
import { KeyConfig, Status, UserRole, apiModelOptions, userRoleOptions } from './model'
import { fetchGetKeys, fetchUpdateApiKeyStatus, fetchUpsertApiKey } from '@/api'
import { t } from '@/locales'
import { useAuthStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const ms = useMessage()
const dialog = useDialog()
const authStore = useAuthStore()
const { isMobile } = useBasicLayout()

const loading = ref(false)
const show = ref(false)
const handleSaving = ref(false)
const keyConfig = ref(new KeyConfig('', 'ChatGPTAPI', [], [], ''))

const keys = ref([])
const columns = [
  {
    title: 'Key',
    key: 'key',
    resizable: true,
    width: 200,
    minWidth: 100,
    maxWidth: 200,
    ellipsis: true,
  },
  {
    title: 'Api Model',
    key: 'keyModel',
    width: 190,
  },
  {
    title: 'Chat Model',
    key: 'chatModels',
    width: 320,
    render(row: any) {
      const tags = row.chatModels.map((chatModel: CHATMODEL) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => chatModel,
          },
        )
      })
      return tags
    },
  },
  {
    title: 'User Roles',
    key: 'userRoles',
    width: 200,
    render(row: any) {
      const tags = row.userRoles.map((userRole: UserRole) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => UserRole[userRole],
          },
        )
      })
      return tags
    },
  },
  {
    title: 'Remark',
    key: 'remark',
    width: 220,
  },
  {
    title: 'Action',
    key: '_id',
    width: 220,
    render(row: KeyConfig) {
      const actions: any[] = []
      actions.push(h(
        NButton,
        {
          size: 'small',
          style: {
            marginRight: '6px',
          },
          type: 'error',
          onClick: () => handleUpdateApiKeyStatus(row._id as string, Status.Disabled),
        },
        { default: () => t('common.delete') },
      ))
      if (row.status === Status.Normal) {
        actions.push(h(
          NButton,
          {
            size: 'small',
            style: {
              marginRight: '6px',
            },
            type: 'info',
            onClick: () => handleEditKey(row),
          },
          { default: () => t('common.edit') },
        ))
      }
      return actions
    },
  },
]
const pagination = reactive({
  page: 1,
  pageSize: 100,
  pageCount: 1,
  itemCount: 1,
  prefix({ itemCount }: { itemCount: number | undefined }) {
    return `Total is ${itemCount}.`
  },
  showSizePicker: true,
  pageSizes: [100],
  onChange: (page: number) => {
    pagination.page = page
    handleGetKeys(pagination.page)
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    handleGetKeys(pagination.page)
  },
})

async function handleGetKeys(page: number) {
  if (loading.value)
    return
  keys.value.length = 0
  loading.value = true
  const size = pagination.pageSize
  const data = (await fetchGetKeys(page, size)).data
  data.keys.forEach((key: never) => {
    keys.value.push(key)
  })
  keyConfig.value = keys.value[0]
  pagination.page = page
  pagination.pageCount = data.total / size + (data.total % size === 0 ? 0 : 1)
  pagination.itemCount = data.total
  loading.value = false
}

async function handleUpdateApiKeyStatus(id: string, status: Status) {
  dialog.warning({
    title: t('chat.deleteKey'),
    content: t('chat.deleteKeyConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      await fetchUpdateApiKeyStatus(id, status)
      ms.info('OK')
      await handleGetKeys(pagination.page)
    },
  })
}

async function handleUpdateKeyConfig() {
  if (!keyConfig.value.key) {
    ms.error('Api key is required')
    return
  }
  handleSaving.value = true
  try {
    await fetchUpsertApiKey(keyConfig.value)
    await handleGetKeys(pagination.page)
    show.value = false
  }
  catch (error: any) {
    ms.error(error.message)
  }
  handleSaving.value = false
}

function handleNewKey() {
  keyConfig.value = new KeyConfig('', 'ChatGPTAPI', [], [], '')
  show.value = true
}

function handleEditKey(key: KeyConfig) {
  keyConfig.value = key
  show.value = true
}

onMounted(async () => {
  await handleGetKeys(pagination.page)
})
</script>

<template>
  <div class="p-4 space-y-5 min-h-[300px]">
    <div class="space-y-6">
      <NSpace vertical :size="12">
        <NSpace>
          <NButton @click="handleNewKey()">
            New Key
          </NButton>
        </NSpace>
        <NDataTable
          ref="table"
          remote
          :loading="loading"
          :row-key="(rowData) => rowData._id"
          :columns="columns"
          :data="keys"
          :pagination="pagination"
          :max-height="444"
          :scroll-x="1300"
          striped @update:page="handleGetKeys"
        />
      </NSpace>
    </div>
  </div>

  <NModal v-model:show="show" :auto-focus="false" preset="card" :style="{ width: !isMobile ? '50%' : '100%' }">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.apiModel') }}</span>
          <div class="flex-1">
            <NSelect
              style="width: 100%"
              :value="keyConfig.keyModel"
              :options="apiModelOptions"
              @update-value="value => keyConfig.keyModel = value"
            />
          </div>
          <p v-if="!isMobile">
            <a v-if="keyConfig.keyModel === 'ChatGPTAPI'" target="_blank" href="https://platform.openai.com/account/api-keys">Get Api Key</a>
            <a v-else target="_blank" href="https://chat.openai.com/api/auth/session">Get Access Token</a>
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.api') }}</span>
          <div class="flex-1">
            <NInput
              v-model:value="keyConfig.key" type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }" placeholder=""
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.chatModels') }}</span>
          <div class="flex-1">
            <NSelect
              style="width: 100%"
              multiple
              :value="keyConfig.chatModels"
              :options="authStore.session?.allChatModels"
              @update-value="value => keyConfig.chatModels = value"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.userRoles') }}</span>
          <div class="flex-1">
            <NSelect
              style="width: 100%"
              multiple
              :value="keyConfig.userRoles"
              :options="userRoleOptions"
              @update-value="value => keyConfig.userRoles = value"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.status') }}</span>
          <div class="flex-1">
            <NSwitch
              :round="false"
              :value="keyConfig.status === Status.Normal"
              @update:value="(val) => { keyConfig.status = val ? Status.Normal : Status.Disabled }"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]">{{ $t('setting.remark') }}</span>
          <div class="flex-1">
            <NInput
              v-model:value="keyConfig.remark" type="textarea"
              :autosize="{ minRows: 1, maxRows: 2 }" placeholder=""
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[100px]" />
          <NButton type="primary" :loading="handleSaving" @click="handleUpdateKeyConfig()">
            {{ $t('common.save') }}
          </NButton>
        </div>
      </div>
    </div>
  </NModal>
</template>
