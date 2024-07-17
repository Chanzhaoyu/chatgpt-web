<script setup lang="ts">
import { ChatBubbleFilled, DeleteRound, NorthRound, PlayArrowFilled, StarBorderOutlined, StarOutlined } from '@vicons/material'
import { NIcon, NInput, useDialog } from 'naive-ui'
import { computed, defineEmits, defineProps, ref } from 'vue'
import { commentChildAdd, commentDel, commentReplyAdd, commentRootAdd, commentStar, commentUnStar } from '@/api'
import { usePdfStore } from '@/store'
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
  pageIds: Array<string>
}
const props = defineProps<Props>()
const emit = defineEmits(['updateComment'])

const pdfStore = usePdfStore()
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
  commentChildAdd: ['pdfPageId', 'rootCommentId'],
  commentReplyAdd: ['pdfPageId', 'rootCommentId', 'replyCommentId'],
  commentStar: [],
  commentUnStar: [],
  commentDel: [],
}
const handleComment = async (type: string, comment: CommentType, replyContent = '') => {
  try {
    if (type === 'commentReply')
      type = 'replyUserName' in comment ? 'commentReplyAdd' : 'commentChildAdd'
    let params = {}
    const fields = requestParamsMap[type] || []
    if (fields.length) {
      fields.forEach((field) => {
        params[field] = comment[field]
        if (field === 'pdfPageId')
          params[field] = computed(() => props.pageIds[pdfStore.currentPage - 1]).value
        if (field === 'rootCommentId')
          params[field] = comment.commentId
      })
      console.log('params', params)
    }
    else {
      // commentStar、commentUnStar、commentDel的参数只需传入commentId字符串，不是对象
      params = comment.commentId
    }
    if (type === 'commentReplyAdd' || type === 'commentChildAdd')
      params.comment = replyContent
    if (apiMethods[type]) {
      console.log(type, params, 'apiMethods，type, params,')

      // await apiMethods[type](params)
      emit('updateComment')
      pdfStore.setActiveCommentId('')
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
const activeCommentId = computed(() => pdfStore.activeCommentId)
const replyContent = ref('')
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
            <span class="text-sm text-nowrap">删除</span>
          </button>
          <button class="flex items-center space-x-1 ml-2" @click="() => pdfStore.setActiveCommentId(comment.commentId)">
            <n-icon size="large">
              <ChatBubbleFilled />
            </n-icon>
            <span class="text-sm text-nowrap">回复</span>
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
      <n-input v-if="activeCommentId === comment.commentId" v-model:value="replyContent" round :placeholder="`回复 ${comment.userName}`" class="my-3">
        <template #suffix>
          <n-icon :component="NorthRound" class="cursor-pointer" @click="handleComment('commentReply', comment, replyContent)">
          </n-icon>
        </template>
      </n-input>

      <div v-if="comment.commentVoList && comment.commentVoList.length" class="mt-4">
        <Comment v-for="reply in comment.commentVoList" :key="reply.commentId" :comment="reply" :page-ids="pageIds" @update-comment="emit('updateComment')" />
      </div>
    </div>
  </div>
</template>

  <style scoped>
  button {
    outline: none;
  }
  </style>
