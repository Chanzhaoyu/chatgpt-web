<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
// import { ElForm } from 'element-plus'
import { NButton, NCheckbox, NCheckboxGroup, NForm, NFormItem, NInput, NSpace } from 'naive-ui'
// import md5 from 'md5'
// import { HOME_URL } from '@/config'
// import { getTimeState } from '@/utils'
// import type { Login } from '@/api/interface'
// import { loginApi } from '@/api/modules/login'
// import { useUserStore } from '@/stores/modules/user'
// import { useTabsStore } from '@/stores/modules/tabs'
// import { useKeepAliveStore } from '@/stores/modules/keepAlive'
// import { initDynamicRouter } from '@/routers/modules/dynamicRouter'

// const router = useRouter()
// const userStore = useUserStore()
// const tabsStore = useTabsStore()
// const keepAliveStore = useKeepAliveStore()

// type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<any>()
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const loading = ref(false)
const loginForm = ref({
  username: '',
  password: '',
})

// login
const login = (formEl: any) => {
  if (!formEl)
    return
  formEl.validate(async (valid: any) => {
    if (!valid)
      return
    loading.value = true
    try {
      // 1.执行登录接口
      // const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) })
      // userStore.setToken(data.access_token)

      // // 2.添加动态路由
      // await initDynamicRouter()

      // // 3.清空 tabs、keepAlive 数据
      // tabsStore.setTabs([])
      // keepAliveStore.setKeepAliveName([])

      // // 4.跳转到首页
      // router.push(HOME_URL)
      // ElNotification({
      //   title: getTimeState(),
      //   message: '欢迎登录 Geeker-Admin',
      //   type: 'success',
      //   duration: 3000,
      // })
    }
    finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  // 监听 enter 事件（调用登录）
  // document.onkeydown = (e: KeyboardEvent) => {
  //   e = (window.event as KeyboardEvent) || e
  //   if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
  //     if (loading.value)
  //       return
  //     login(loginFormRef.value)
  //   }
  // }
})

onBeforeUnmount(() => {
  document.onkeydown = null
})
</script>

<template>
  <n-form ref="formRef">
    <n-form-item>
      <div class="login-form-header">
        <span class="login-title">登录</span>
        <div class="login-title-bar"></div>
      </div>
    </n-form-item>
    <n-form-item>
      <n-input class="login-input" size="large" placeholder="请输入校园邮箱" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item>
      <n-input
        class="login-input"
        size="large"
        placeholder="请输入验证码"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item>
      <n-checkbox-group>
        <n-space item-style="display: flex;">
          <n-checkbox label="by signing up you accept the Terms of Service and Privacy Policy" />
        </n-space>
      </n-checkbox-group>
    </n-form-item>
    <n-form-item>
      <n-button type="primary" style="width: 100%;">
        登录
      </n-button>
    </n-form-item>
  </n-form>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>
