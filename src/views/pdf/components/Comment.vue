<script setup lang="ts">
import { ChatBubbleFilled, DeleteRound, PlayArrowFilled, StarBorderOutlined, StarOutlined } from '@vicons/material'
import { NIcon, useDialog } from 'naive-ui'
import { defineEmits } from 'vue'
import { commentStar } from '@/api'

export interface CommentType {
  commentId: string
  comment: string
  userIconUrl: string
  userName: string
  createTime: string
  starCount: string
  isStared: boolean
  replyUserName?: string
  commentVoList?: CommentType[]
}
interface Props {
  comment: CommentType
}
defineProps<Props>()
const emit = defineEmits(['updateComment'])

const dialog = useDialog()

const handleCommentStar = async (type: string, commentId: string) => {
  try {
    if (commentId)
      await commentStar(commentId)
    emit('updateComment')
  }
  catch (error) {
    let message = '请稍后再试'
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: string }).message === 'string')
      message = (error as { message: string }).message
    else if (error instanceof Error)
      message = error.toString()

    dialog.error({
      title: '错误',
      content: message,
      positiveText: '我知道了',
    })
    console.error('Error fetching course list:', error)
  }
}
</script>

<template>
  <div class="flex items-start space-x-4 p-4 pr-0">
    <img :src="comment.userIconUrl" alt="user" class="w-10 h-10 rounded-full">
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h4 class="font-semibold">
            {{ comment.userName }}
          </h4>
          <span v-if="comment.replyUserName" class="flex items-center font-semibold">
            <n-icon size="large" class="text-gray-500 mx-1">
              <PlayArrowFilled />
            </n-icon>
            {{ comment.replyUserName }}</span>
        </div>
      </div>
      <p class="mt-2 text-gray-700">
        {{ comment.comment }}
      </p>
      <div class="flex justify-between items-center mt-2 text-gray-400">
        <span class="text-sm text-gray-500">{{ comment.createTime }}</span>
        <div class="right flex items-center">
          <button class="flex items-center space-x-1">
            <n-icon size="large">
              <DeleteRound />
            </n-icon>
            <span class="text-sm">删除</span>
          </button>
          <button class="flex items-center space-x-1 ml-4">
            <n-icon size="large">
              <ChatBubbleFilled />
            </n-icon>
            <span class="text-sm">回复</span>
          </button>
          <button class="space-x-1 ml-4" @click="commentStar(comment.commentId)">
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
