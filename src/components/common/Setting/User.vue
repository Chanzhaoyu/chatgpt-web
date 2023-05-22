<script lang="ts" setup>
import { h, onMounted, reactive, ref } from 'vue'
import { NButton, NDataTable, NTag, useDialog, useMessage } from 'naive-ui'
import { Status } from './model'
import { fetchGetUsers, fetchUpdateUserStatus } from '@/api'
import { t } from '@/locales'

const ms = useMessage()
const dialog = useDialog()
const loading = ref(false)

const users = ref([])
const columns = [
  {
    title: 'Email',
    key: 'email',
    resizable: true,
    width: 200,
    minWidth: 100,
    maxWidth: 200,
  },
  {
    title: '注册时间',
    key: 'createTime',
    width: 220,
  },
  {
    title: '验证时间',
    key: 'verifyTime',
    width: 220,
  },
  {
    title: '管理员',
    key: 'status',
    width: 200,
    render(row: any) {
      if (row.root) {
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
            default: () => 'Admin',
          },
        )
      }
      return '-'
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 200,
    render(row: any) {
      return Status[row.status]
    },
  },
  {
    title: 'Action',
    key: '_id',
    width: 200,
    render(row: any) {
      const actions: any[] = []
      if (row.root)
        return actions

      if (row.status === Status.Normal) {
        actions.push(h(
          NButton,
          {
            size: 'small',
            type: 'error',
            onClick: () => handleUpdateUserStatus(row._id, Status.Deleted),
          },
          { default: () => t('chat.deleteUser') },
        ))
      }
      if (row.status === Status.PreVerify || row.status === Status.AdminVerify) {
        actions.push(h(
          NButton,
          {
            size: 'small',
            type: 'info',
            onClick: () => handleUpdateUserStatus(row._id, Status.Normal),
          },
          { default: () => t('chat.verifiedUser') },
        ))
      }
      return actions
    },
  },
]
const pagination = reactive ({
  page: 1,
  pageSize: 25,
  pageCount: 1,
  itemCount: 1,
  prefix({ itemCount }: { itemCount: number | undefined }) {
    return `Total is ${itemCount}.`
  },
  showSizePicker: true,
  pageSizes: [25, 50, 100],
  onChange: (page: number) => {
    pagination.page = page
    handleGetUsers(pagination.page)
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    handleGetUsers(pagination.page)
  },
})

async function handleGetUsers(page: number) {
  if (loading.value)
    return
  users.value.length = 0
  loading.value = true
  const size = pagination.pageSize
  const data = (await fetchGetUsers(page, size)).data
  data.users.forEach((user: never) => {
    users.value.push(user)
  })
  pagination.page = page
  pagination.pageCount = data.total / size + (data.total % size === 0 ? 0 : 1)
  pagination.itemCount = data.total
  loading.value = false
}

async function handleUpdateUserStatus(userId: string, status: Status) {
  if (status === Status.Deleted) {
    dialog.warning({
      title: t('chat.deleteUser'),
      content: t('chat.deleteUserConfirm'),
      positiveText: t('common.yes'),
      negativeText: t('common.no'),
      onPositiveClick: async () => {
        await fetchUpdateUserStatus(userId, status)
        ms.info('OK')
        await handleGetUsers(pagination.page)
      },
    })
  }
  else {
    await fetchUpdateUserStatus(userId, status)
    ms.info('OK')
    await handleGetUsers(pagination.page)
  }
}

onMounted(async () => {
  await handleGetUsers(pagination.page)
})
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <NDataTable
        ref="table"
        remote
        :loading="loading"
        :row-key="(rowData) => rowData._id"
        :columns="columns"
        :data="users"
        :pagination="pagination"
        :max-height="444"
        striped
        @update:page="handleGetUsers"
      />
    </div>
  </div>
</template>
