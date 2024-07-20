<script setup lang="ts">
import { ChatBubbleFilled, DeleteRound, NorthRound, PlayArrowFilled, StarBorderOutlined, StarOutlined } from '@vicons/material'
import { NIcon, NInput, useDialog } from 'naive-ui'
import { computed, defineEmits, defineProps, ref } from 'vue'
import { commentChildAdd, commentDel, commentReplyAdd, commentStar, commentUnStar } from '@/api'
import { usePdfStore } from '@/store'
export interface CommentType {
  commentId: string
  comment: string
  userAvatarUrl: string
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
  commentChildAdd,
  commentReplyAdd,
  commentStar,
  commentUnStar,
  commentDel,
}
const activeCommentId = computed(() => pdfStore.activeCommentId)
const replyContent = ref('')

const handleComment = async (type: string, comment: CommentType, commentContent = '') => {
  try {
    let params = {}
    if (type === 'commentReply') {
      type = 'replyUserName' in comment ? 'commentReplyAdd' : 'commentChildAdd'
      params.comment = commentContent
      if (type === 'commentChildAdd')
        params.rootCommentId = comment.commentId
      else
        params.replyCommentId = comment.commentId
    }
    else {
      // commentStar、commentUnStar、commentDel的参数只需传入commentId字符串，不是对象
      params = comment.commentId
    }
    if (apiMethods[type]) {
      await apiMethods[type](params)
      emit('updateComment')
      replyContent.value = ''
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
</script>

<template>
  <div class="flex items-start space-x-4">
    <img :src="comment.userAvatarUrl" alt="user" class="w-10 h-10 rounded-full">
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
      <div class="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span class="text-gray-500">{{ comment.createTime }}</span>
        <div class="right flex items-center">
          <button v-if="comment.isMyComment" class="flex items-center">
            <n-icon size="large">
              <DeleteRound />
            </n-icon>
            <span class="text-nowrap">删除</span>
          </button>
          <button class="flex items-center ml-2" @click="() => pdfStore.setActiveCommentId(comment.commentId)">
            <n-icon size="large">
              <ChatBubbleFilled />
            </n-icon>
            <span class="text-nowrap">回复</span>
          </button>
          <button class="ml-2">
            <div class="flex items-center">
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
