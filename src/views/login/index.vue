<script setup lang="ts" name="login">
import { NFlex } from 'naive-ui'
import LoginForm from './components/LoginForm.vue'
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <n-flex vertical style="height: 100%;width: 100%;">
          <div class="login-left-text">
            <div class="text-container">
              <div class="text1-container">
                <span class="text1">Welcome to</span>
              </div>
              <div class="text2-container">
                <span class="text2">薯塔AI</span>
              </div>
            </div>
          </div>
          <div class="login-left-img-container">
            <img class="login-left-img" src="@/assets/AI-logo.png" alt="login">
          </div>
        </n-flex>
      </div>
      <div class="login-form">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
