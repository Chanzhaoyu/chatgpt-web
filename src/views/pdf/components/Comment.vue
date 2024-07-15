<script setup lang="ts">
import { ChatBubbleFilled, DeleteRound, NorthRound, PlayArrowFilled, StarBorderOutlined, StarOutlined } from '@vicons/material'
import { NIcon, NInput, useDialog } from 'naive-ui'
import { defineEmits } from 'vue'
import { commentChildAdd, commentDel, commentReplyAdd, commentRootAdd, commentStar, commentUnStar } from '@/api'
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
const apiMethods = {
  commentRootAdd,
  commentChildAdd,
  commentReplyAdd,
  commentStar,
  commentUnStar,
  commentDel,
}

const requestParamsMap = {
  commentRootAdd: ['comment', 'pdfPageId'],
  commentChildAdd: ['comment', 'pdfPageId', 'rootCommentId'],
  commentReplyAdd: ['comment', 'pdfPageId', 'rootCommentId', 'replyCommentId'],
  commentStar: [],
  commentUnStar: [],
  commentDel: [],
}
const handleComment = async (type: string, comment) => {
  try {
    console.log('type:', type)
    if (type === 'commentReply') {
      if (Object.keys(comment).includes('replyUserName'))
        type = 'commentReplyAdd'
      else
        type = 'commentChildAdd'
    }
    let params = {}
    const fields = requestParamsMap[type]
    debugger
    if (fields.length) {
      fields.forEach((field) => {
        if (comment[field] !== undefined)
          params[field] = comment[field]
      })
    }
    else {
      params = comment.commentId
    }

    if (apiMethods[type]) {
      await apiMethods[type](params)
      emit('updateComment')
    }
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
    <!-- <img :src="comment.userIconUrl" alt="user" class="w-10 h-10 rounded-full"> -->
    <img src="https://randomuser.me/api/portraits/women/8.jpg" alt="user" class="w-10 h-10 rounded-full">
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
        <!-- <span class="text-sm text-gray-500">{{ comment.createTime }}</span> -->
        <span class="text-sm text-gray-500">07-13</span>
        <div class="right flex items-center">
          <button class="flex items-center space-x-1">
            <n-icon size="large">
              <DeleteRound />
            </n-icon>
            <span class="text-sm text-nowrap">删除</span>
          </button>
          <button class="flex items-center space-x-1 ml-2">
            <n-icon size="large">
              <ChatBubbleFilled />
            </n-icon>
            <span class="text-sm" @click="handleComment('commentReply', comment)">回复</span>
          </button>
          <button class="space-x-1 ml-2">
            <div class="text-sm flex items-center">
              <n-icon size="large">
                <template v-if="comment.isStared">
                  <StarOutlined color="#E2953E" @click="handleComment('commentUnStar', comment)" />
                </template>
                <template v-else>
                  <StarBorderOutlined @click="handleComment('commentStar', comment)" />
                </template>
              </n-icon>
              <p class="min-w-3">
                {{ comment.starCount }}
              </p>
            </div>
          </button>
        </div>
      </div>
      <n-input round placeholder="评论..." class="my-3">
        <template #suffix>
          <n-icon :component="NorthRound" class="cursor-pointer">
          </n-icon>
        </template>
      </n-input>

      <div v-if="comment.commentVoList && comment.commentVoList.length" class="mt-4">
        <Comment v-for="reply in comment.commentVoList" :key="reply.commentId" :comment="reply" @update-comment="emit('updateComment')" />
      </div>
    </div>
  </div>
</template>

  <style scoped>
  button {
    outline: none;
  }
  </style>
