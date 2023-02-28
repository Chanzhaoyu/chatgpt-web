<script setup lang='ts'>
import { NTabPane, NTabs } from 'naive-ui'
import { SvgIcon } from '@/components/common'
</script>

<template>
  <div class="container m-auto">
    <div class="p-4">
      <h2 class="py-6 mb-4 text-2xl font-bold">
        个人中心
      </h2>
      <NTabs type="line" animated>
        <NTabPane name="General" tab="总览">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">总览</span>
          </template>
          <span>General</span>
        </NTabPane>
        <NTabPane name="Billing" tab="账单">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:bill-line" />
            <span class="ml-2">账单</span>
          </template>
          <span>Billing</span>
        </NTabPane>
        <NTabPane name="Notification" tab="通知">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:notification-4-line" />
            <span class="ml-2">通知</span>
          </template>
          <span>Notification</span>
        </NTabPane>
        <NTabPane name="ChangePassword" tab="修改密码">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:key-line" />
            <span class="ml-2">修改密码</span>
          </template>
          <span>Change Password</span>
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>

<style>

</style>
