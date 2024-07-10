<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { AddCircleOutlineOutlined } from '@vicons/material'
import List from './List.vue'
import agent from './agent.vue'
</script>

<template>
    <div class="p-4">
        <NButton type="primary">
            <template #icon>
                <n-icon>
                    <AddCircleOutlineOutlined />
                </n-icon>
            </template>
            创建智能体
        </NButton>
    </div>
    <div class="flex-1 min-h-0 pb-4 overflow-hidden">
        <agent />
    </div>
    <div class="flex-1 min-h-0 pb-4 overflow-hidden">
        <List />
    </div>
    <div class="flex items-center p-4 space-x-4">
    </div>
</template>

<style scoped lang="scss"></style>