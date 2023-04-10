<script lang="ts" setup>
import { ref } from 'vue'
import type { FormItemRule, FormRules, UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSelect,
  NSpace,
  NUpload,
  useMessage,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { createModel as createModelApi, prepareData } from '@/api/index'

const router = useRouter()
const message = useMessage()

const formData = ref({
  suffix: '',
  model: 'ada',
  training_file: null,
})

const rules: FormRules = {
  suffix: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value)
          return new Error('请填写模型名称')
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  model: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value)
          return new Error('请选择基础模型')
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  training_file: [
    {
      required: true,
    },
  ],
}

const modelOptions = [{
  label: 'ada',
  value: 'ada',
}, {
  label: 'babbage',
  value: 'babbage',
}, {
  label: 'curie',
  value: 'curie',
}, {
  label: 'davinci',
  value: 'davinci',
}]

const afterPreparedData = ref({})

const fileList = ref<UploadFileInfo[]>([])
const customRequest = ({
  file,
  onFinish,
  onError,
}: UploadCustomRequestOptions) => {
  const formData = new FormData()
  formData.append(file.name, file.file as File)
  fileList.value[0].status = 'uploading'
  fileList.value[0].percentage = 100
  prepareData<{ fileId: string; preparedData: string }>(formData)
    .then((res) => {
      const { fileId, preparedData } = res?.data as { fileId: string; preparedData: string } || { fileId: '', preparedData: '' }
      fileList.value[0].id = fileId

      try {
        afterPreparedData.value = JSON.parse(preparedData)
      }
      catch (error) {
        afterPreparedData.value = {}
      }
      onFinish()
    })
    .catch(() => {
      onError()
    })
}

const showPreparedDataModal = ref(false)
const viewData = () => {
  showPreparedDataModal.value = true
}

const createModel = async () => {
  if (!formData.value.suffix.length) {
    return message.error(
      '请填写模型名称',
    )
  }

  if (!formData.value.model.length) {
    return message.error(
      '请选择基础模型',
    )
  }

  if (!fileList.value.length || fileList.value[0].status !== 'finished') {
    return message.error(
      '请检查上传文件',
    )
  }

  const { status } = await createModelApi({
    model: formData.value.model,
    suffix: formData.value.suffix,
    training_file: fileList.value[0].id,
  })

  if (status === 'Success')
    message.success('创建成功')

  else
    message.error('创建失败')
}
const cancel = () => {
  router.go(-1)
}
</script>

<template>
  <div class="model-create w-full h-full">
    <div class="model-create__header">
      微调创建
    </div>
    <div class="model-create__content">
      <div class="model-create__content-main">
        <NForm ref="formRef" :model="formData" :rules="rules">
          <NFormItem path="suffix" label="模型名称">
            <NInput v-model:value="formData.suffix" @keydown.enter.prevent />
          </NFormItem>
          <NFormItem
            label="基础模型"
            path="model"
          >
            <NSelect
              v-model:value="formData.model"
              :options="modelOptions"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="数据文件"
            path="training_file"
          >
            <NUpload
              v-model:file-list="fileList"
              :custom-request="customRequest"
              accept=".csv, .tsv, .xlsx, .json, .jsonl"
            >
              <NButton>上传文件</NButton>
            </NUpload>
          </NFormItem>
          <div
            v-if="fileList.length && fileList[0].status === 'finished'"
            class="text-[#3366ff] hover:cursor-pointer"
            @click="viewData"
          >
            数据预览
          </div>
        </NForm>
      </div>
    </div>
    <div class="model-create__footer">
      <NSpace>
        <NButton type="info" @click="createModel">
          创建
        </NButton>
        <NButton @click="cancel">
          取消
        </NButton>
      </NSpace>
    </div>
    <NModal
      v-model:show="showPreparedDataModal"
      preset="card"
      title="数据预览"
      :style="{ width: '800px' }"
      size="huge"
      :bordered="false"
    >
      <div class="h-[600px]">
        <JsonViewer :value="afterPreparedData" copyable sort theme="jv-light" class="h-[600px] overflow-auto" />
      </div>
    </NModal>
  </div>
</template>

<style lang="less" scoped>
.model-create {
  display: flex;
  flex-direction: column;

  &__header {
    height: 48px;
    font-weight: bold;
    box-shadow: inset 0 -1px #e1e5eb;
    padding: 0 16px;
    line-height: 48px;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    &-main {
      width: 50%;
      height: 500px;
    }
  }
  &__footer {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 1px #e1e5eb;
  }
}
</style>
