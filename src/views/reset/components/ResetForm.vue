<!-- eslint-disable no-useless-return -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref } from 'vue'
// import { ElForm } from 'element-plus'
import { NButton, NCheckbox, NCheckboxGroup, NForm, NFormItem, NIcon, NInput, NPopover, NSpace, useMessage } from 'naive-ui'
import { EmailOutlined, Grid3X3Filled, LockOutlined } from '@vicons/material'
import { useRouter } from 'vue-router'
import { getCode, registerAccount } from '@/api'
const router = useRouter()
const message = useMessage()
const registerFormRef = ref<any>()
const registerRules = ref<any>({
  email: [{ key: 'a', required: true, message: '请输入校园邮箱', trigger: 'change' }],
  password: [{ key: 'b', required: true, message: '请输入密码', trigger: 'change' }],
  code: [{ key: 'c', required: true, message: '请输入验证码', trigger: 'change' }],
  check: [{ key: 'd', required: true, message: '请勾选服务协议', trigger: 'change', type: 'array' }],
})

const loading = ref(false)
const regsiterForm = ref({
  email: '',
  password: '',
  code: '',
  check: null,
})

// login
const register = (e: MouseEvent) => {
  e.preventDefault()
  registerFormRef.value.validate(
    async (errors: any) => {
      if (errors) {
        console.error(errors)
      }
      else {
        const data = await registerAccount({ email: `${regsiterForm.value.email}@link.cuhk.edu.cn`, password: regsiterForm.value.password, secondPassword: regsiterForm.value.password, code: regsiterForm.value.code })
      }
    },
  )
}
const getEmailCode = (e: MouseEvent) => {
  e.preventDefault()
  registerFormRef.value.validate(
    async (errors: any) => {
      if (errors) {
        console.error(errors)
      }
      else {
        const data = await getCode(`${regsiterForm.value.email}@link.cuhk.edu.cn`)
      }
    },
    (rule: any) => {
      return rule?.key === 'a'
    },
  )
}
</script>

<template>
  <n-form ref="registerFormRef" :rules="registerRules" :model="regsiterForm">
    <n-form-item>
      <div class="login-form-header">
        <span class="login-title">重置密码</span>
        <div class="login-title-bar"></div>
      </div>
    </n-form-item>
    <n-form-item path="email">
      <n-input v-model:value="regsiterForm.email" size="large" class="login-input" placeholder="请输入校园邮箱" @keydown.enter.prevent>
        <template #suffix>
          <div class="login-input-suffix">
            <span class="login-input-suffix-text">@link.cuhk.edu.cn</span>
          </div>
        </template>
        <template #prefix>
          <n-icon>
            <EmailOutlined />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="code">
      <n-input
        v-model:value="regsiterForm.code"
        size="large"
        class="login-input"
        placeholder="请输入验证码"
        @keydown.enter.prevent
      >
        <template #suffix>
          <div class="login-input-suffix-code" style="cursor: pointer;">
            <span class="login-input-suffix-text" @click="getEmailCode">获取验证码</span>
          </div>
        </template>
        <template #prefix>
          <n-icon>
            <Grid3X3Filled />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input v-model:value="regsiterForm.password" size="large" class="login-input" placeholder="请输入密码" @keydown.enter.prevent>
        <template #suffix>
          <div class="login-input-suffix2">
            <span class="login-input-suffix-text2">@link.cuhk.edu.cn</span>
          </div>
        </template>
        <template #prefix>
          <n-icon>
            <LockOutlined />
          </n-icon>
        </template>
      </n-input>
    </n-form-item>

    <n-form-item path="check">
      <n-checkbox-group v-model:value="regsiterForm.check">
        <n-space item-style="display: flex;">
          <n-checkbox value="checked">
            <span>by signing up you accept the</span>
            <n-popover trigger="hover">
              <template #trigger>
                <span style="color: #72B3FF"> Terms of Service</span>
              </template>
              <span>12341234</span>
            </n-popover>
            <span> and</span>
            <n-popover trigger="hover">
              <template #trigger>
                <span style="color: #72B3FF"> Privacy Policy</span>
              </template>
              <span>23452345</span>
            </n-popover>
          </n-checkbox>
        </n-space>
      </n-checkbox-group>
    </n-form-item>
    <n-form-item>
      <div class="login-button-container">
        <n-button type="primary" class="login-button" @click="register">
          登录
        </n-button>
        <span class="login-back" @click="router.push('/login')">返回登录 ></span>
      </div>
    </n-form-item>
  </n-form>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>
