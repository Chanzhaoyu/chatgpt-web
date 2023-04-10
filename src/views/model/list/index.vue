<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { NButton, NDataTable, NModal } from 'naive-ui'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import ModelDetailTable from '../components/ModelDetailTable.vue'
import { ROUTER } from '@/router/const'
import { fetchList } from '@/api'
import type { HyperParam, TrainingFile } from '@/api/types'

interface ListItem {
  created_at: number
  updated_at: number
  validation_files: TrainingFile[]
  hyperparams: HyperParam
  id: string
  fine_tuned_model: string
  model: string
  object: string
  organization_id: string
  result_files: TrainingFile[]
  status: string
  training_files: TrainingFile[]
}

interface TableListItem {
  created_at: string
  id: string
  fine_tuned_model: string
  model: string
  status: string
  super_param: string
}

const router = useRouter()

const goBack = () => {
  router.push({
    name: ROUTER.name.root,
  })
}

const toCreate = () => {
  router.push({
    name: ROUTER.name.modelCreate,
  })
}

const detailModelId = ref('')
const showModal = ref(false)
const seeDetail = (detail: TableListItem) => {
  detailModelId.value = detail.id
  showModal.value = true
}

const columns = [
  {
    title: '模型名称',
    key: 'fine_tuned_model',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '模型ID',
    key: 'id',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '基础模型',
    key: 'model',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '创建时间',
    key: 'created_at',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '超参数',
    key: 'super_param',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(row: TableListItem) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'info',
          onClick: () => seeDetail(row),
        },
        { default: () => '查看详情' },
      )
    },
  },
]
const list = ref<TableListItem[]>([])

onMounted(async () => {
  const { data } = await fetchList<ListItem[]>()

  list.value = data.map((item) => {
    return {
      id: item.id || '',
      fine_tuned_model: item.fine_tuned_model || '',
      model: item.model || '',
      created_at: dayjs.unix(item.created_at || 0).format('YYYY-MM-DD HH:mm:ss'),
      status: item.status || '',
      super_param: JSON.stringify(item.hyperparams),
    }
  }) as TableListItem[]

  window.console.log(data)
})
</script>

<template>
  <div class="model-list h-full w-full p-4">
    <div class="model-list__header">
      <div>
        <NButton @click="goBack">
          chat
        </NButton>
      </div>
      <NButton type="info" @click="toCreate">
        创建
      </NButton>
    </div>
    <div class="model-list__content">
      <NDataTable :columns="columns" :data="list" :style="{ height: `calc(100% - 12px)` }" flex-height :bordered="false" />
    </div>
    <NModal
      v-model:show="showModal"
      class="custom-card"
      preset="card"
      title="详情"
      :style="{ width: '800px' }"
      size="huge"
      :bordered="false"
    >
      <ModelDetailTable :id="detailModelId" />
    </NModal>
  </div>
</template>

<style lang="less" scoped>
.model-list {
    display: flex;
    flex-direction: column;
    &__header {
        height: 48px;
        box-shadow: inset 0 -1px #e1e5eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
    }

    &__content {
        flex: 1;
        padding: 38px 100px 12px;
    }

}
</style>
