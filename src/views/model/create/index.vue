<script lang="ts" setup>
import { ref } from 'vue'
import type { FormItemRule, FormRules } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NSelect, NSpace } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  suffix: null,
  model: null,
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

const cancel = () => {
  router.go(-1)
}
</script>

<template>
  <div class="model-create w-full h-full">
    <div class="model-create__header">
      模型创建
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
        </NForm>
      </div>
    </div>
    <div class="model-create__footer">
      <NSpace>
        <NButton type="info">
          创建
        </NButton>
        <NButton @click="cancel">
          取消
        </NButton>
      </NSpace>
    </div>
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
