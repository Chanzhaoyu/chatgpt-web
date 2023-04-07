<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NDataTable } from 'naive-ui'
import dayjs from 'dayjs'
import { fetchModelDetail } from '@/api/index'

interface Props {
  id: string
}

interface ModelDetailItem {
  created_at: number | string
  level: string
  message: string
  object: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
})
const columns = [
  {
    title: 'object',
    key: 'object',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: 'created_at',
    key: 'created_at',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: 'level',
    key: 'level',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: 'message',
    key: 'message',
    ellipsis: {
      tooltip: true,
    },
  },
]

const list = ref<ModelDetailItem[]>([])
const isLoadingData = ref(false)

onMounted(async () => {
  isLoadingData.value = true
  const { data } = await fetchModelDetail<ModelDetailItem[]>(props.id)
  isLoadingData.value = false
  list.value = data.map(item => ({
    ...item,
    created_at: dayjs.unix(item.created_at as number || 0).format('YYYY-MM-DD HH:mm:ss'),
  }))
  window.console.log(data)
})
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="list"
    :style="{ height: `600px`, width: '100%' }"
    flex-height :bordered="false"
    :loading="isLoadingData"
  />
</template>
