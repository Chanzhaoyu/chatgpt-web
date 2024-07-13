<script setup lang="ts">
import { ChatBubbleFilled, StarBorderOutlined, StarOutlined } from '@vicons/material'
import { NIcon } from 'naive-ui'

interface CommentType {
  commentId: string
  comment: string
  userIconUrl: string
  userName: string
  createTime: string
  starCount: string
  isStared: boolean
  commentVoList?: CommentType[]
}
interface Props {
  comment: CommentType
}
defineProps<Props>()
</script>

<template>
  <div class="flex items-start space-x-4 p-4">
    <img :src="comment.userIconUrl" alt="user" class="w-10 h-10 rounded-full">
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <h4 class="font-semibold">
          {{ comment.userName }}
        </h4>
      </div>
      <p class="mt-2 text-gray-700">
        {{ comment.comment }}
      </p>
      <div class="flex justify-between items-center mt-2 text-gray-400">
        <span class="text-sm text-gray-500">{{ comment.createTime }}</span>
        <div class="right flex items-center">
          <button class="flex items-center space-x-1">
            <n-icon size="large">
              <ChatBubbleFilled />
            </n-icon>
            <span class="text-sm">回复</span>
          </button>
          <button class="space-x-1 ml-4">
            <div class="text-sm flex items-center">
              <n-icon size="large">
                <template v-if="comment.isStared">
                  <StarOutlined color="#E2953E" />
                </template>
                <template v-else>
                  <StarBorderOutlined />
                </template>
              </n-icon>
              <p>{{ comment.starCount }}</p>
            </div>
          </button>
        </div>
      </div>
      <div v-if="comment.commentVoList && comment.commentVoList.length" class="mt-4">
        <Comment v-for="reply in comment.commentVoList" :key="reply.commentId" :comment="reply" />
      </div>
    </div>
  </div>
</template>

  <style scoped>
  button {
    outline: none;
  }
  </style>
