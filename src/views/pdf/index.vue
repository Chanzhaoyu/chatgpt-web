<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import { NIcon, NInput, NTabPane, NTabs, useMessage } from 'naive-ui'
import { MoreHorizRound, MoreVertRound, NorthRound } from '@vicons/material'
import type { CommentType } from './components/Comment.vue'
import Comment from './components/Comment.vue'
import AIChat from './components/AIChat/AIChat.vue'
import { commentRootAdd, commentRootList, pdfInfo } from '@/api'
import { usePdfStore } from '@/store/modules/pdf'
import { useMarkdown } from '@/hooks/useMarkdown'
import { formatCommentTime } from '@/utils/functions'
import '@/styles/markdown.css'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export interface PageSummary {
  pageId: string
  pagePosition: number
  summary: string
  chineseSummary: string
}

interface PdfSummary {
  signedUrl: string
  pageSummaryList: PageSummary[]
}

const route = useRoute()
const router = useRouter()
const pdfId = ref<string>('')
const summaryResult = ref<PageSummary[]>()
const pageIds = ref<string[]>([])
const sourceRef = ref<string>('')
const name = ref('comment')
const message = useMessage()
const pdfStore = usePdfStore()
const panels = ref([{ tab: 'AI chat', value: 'chat' }, { tab: '评论区', value: 'comment' }, { tab: 'my star', value: 'star' }])

const pdfUrl = ref('') // pdf文件地址
const fileUrl = '/pdfjs-4.4.168-dist/web/viewer.html?file=' // pdfjs文件地址
const renderPage = ref(1)
const comments: Ref<CommentType | null> = ref(null)
const commentContent = ref('')
const getPdfInfo = async () => {
  try {
    if (pdfId.value) {
      const res = await pdfInfo<CommentType>(pdfId.value)
      if (res.data.pageSummaryList.length) {
        summaryResult.value = res.data.pageSummaryList.map((summary) => {
          return {
            pageId: summary.pageId,
            pagePosition: summary.pagePosition,
            summary: summary.summary,
            chineseSummary: summary.chineseSummary,
          }
        })
        pageIds.value = res.data.pageSummaryList.map(item => item.pageId)
        const originalUrl = res.data.signedUrl
        const apiUrl = originalUrl.replace('https://cuhk-ai.oss-cn-shenzhen.aliyuncs.com', '')
        sourceRef.value = apiUrl
        pdfStore.setSourceurl(apiUrl)
      }
      else {
        throw new Error('无有效数据')
      }
    }
    else {
      throw new Error('PDF id为空')
    }
  }
  catch (error) {
    message.warning('PDF无法访问或找不到PDF')
    router.go(-1)
    console.error('error', error) // 使用 console.error 记录错误
  }
}
const getComment = async (summaryResultVal: PageSummary[], page: number) => {
  try {
    const realPage = page - 1

    if (summaryResultVal.length && page && summaryResultVal[realPage]) {
      const res = await commentRootList<CommentType>(summaryResultVal[realPage].pageId)
      if (res.data) {
        comments.value = res.data.map((ele) => {
          const formattedCommentVoList = ele.commentVoList.map((comment) => {
            return {
              ...comment,
              createTime: formatCommentTime(comment.createTime),
            }
          })
          return {
            commentId: ele.comment.commentId,
            comment: ele.comment.comment,
            userAvatarUrl: ele.comment.userAvatarUrl,
            userName: ele.comment.userName,
            createTime: formatCommentTime(ele.comment.createTime),
            starCount: ele.comment.starCount,
            isStared: ele.comment.isStared,
            isMyComment: ele.comment.isMyComment,
            commentVoList: formattedCommentVoList,
          }
        })
      }
      else {
        throw new Error('无有效数据')
      }
    }
  }
  catch (error) {
    message.error(error.response?.data?.message || error.message || '发生未知错误')
    console.error('error', error) // 使用 console.error 记录错误
  }
}

onMounted(async () => {
  pdfId.value = route.query.pdfId as string
  await getPdfInfo()
  // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
  // 核心就是将 iframe 的 src 属性设置为 pdfjs 的地址，然后将 pdf 文件的地址作为参数传递给 pdfjs
  // 例如：http://localhost:8080/pdfjs-4.0.189-dist/web/viewer.html?file=http%3A%2F%2Flocalhost%3A8080%2Fpdf%2Ftest.pdf
  pdfUrl.value = `${fileUrl + encodeURIComponent(sourceRef.value)}#page=${renderPage.value}`
  if (summaryResult.value)
    getComment(summaryResult.value, renderPage.value)
})

function debounce(func, wait, immediate) {
  let timeout
  return function () {
    const context = this; const args = arguments
    const later = function () {
      timeout = null
      if (!immediate)
        func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow)
      func.apply(context, args)
  }
}
setTimeout(() => {
  const iFrame = document.getElementById('iframe_id')

  // 滚动事件处理函数
  function handleScroll() {
    if (iFrame.contentWindow && iFrame.contentWindow.PDFViewerApplication) {
      const pageNumber = iFrame.contentWindow.PDFViewerApplication.pdfViewer.currentPageNumber
      pdfStore.setCurrentPage(pageNumber)
    }
  }

  // 应用防抖处理
  const debouncedHandleScroll = debounce(handleScroll, 100) // 250 毫秒防抖

  // 添加事件监听器
  if (iFrame.contentWindow) {
    const viewerContainer = iFrame.contentWindow.document.getElementById('viewerContainer') // 确保这是正确的容器 ID
    if (viewerContainer)
      viewerContainer.addEventListener('scroll', debouncedHandleScroll)
  }
}, 500)

watch(() => pdfStore.currentPage, (newPage) => {
  pdfUrl.value = `${fileUrl + encodeURIComponent(sourceRef.value)}#page=${newPage}`
  renderPage.value = newPage
  if (summaryResult.value)
    getComment(summaryResult.value, newPage)
})

interface CommentData {
  comment: string
  pdfPageId: string
}

const addRootComment = async (data: CommentData) => {
  try {
    if (!data.comment || !data.pdfPageId)
      throw new Error('comment or pdfPageId is null')

    await commentRootAdd(data)
    commentContent.value = ''
    if (summaryResult.value && renderPage.value)
      await getComment(summaryResult.value, renderPage.value)
    else
      throw new Error('添加评论失败')
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || '发生未知错误'
    message.warning(errorMessage)
  }
}

const isEnSummary = ref(false)
const setisEnSummary = (value: boolean) => {
  isEnSummary.value = value
}

const iframeRef = ref(null)
const horizBarRef = ref(null)
const contentRef = ref(null)
const rightBarRef = ref(null)
const downHoriz = (e) => {
  changeIframeDivStyle('block')
  const startY = e.clientY
  const offsetY = horizBarRef.value.offsetTop
  document.onmousemove = (e) => {
    const endY = e.clientY
    const height = offsetY - (startY - endY)
    iframeRef.value.style.height = `${height}px`
  }
  document.onmouseup = (e) => {
    document.onmousemove = null
    document.onmouseup = null
    changeIframeDivStyle('none')
  }
}
const downRight = (e) => {
  const startX = e.clientX
  const offsetX = rightBarRef.value.offsetLeft
  document.onmousemove = (e) => {
    const endX = e.clientX
    contentRef.value.style.width = `${offsetX - (startX - endX)}px`
  }
  document.onmouseup = (e) => {
    document.onmousemove = null
    document.onmouseup = null
  }
}
onMounted(() => {
  changeIframeDivStyle('none')
  if (typeof horizBarRef.value.setCapture === 'function')
    horizBarRef.value.setCapture()
  horizBarRef.value.onmouseup = () => {
    horizBarRef.value.releaseCapture()
  }
})
onMounted(() => {
  if (typeof rightBarRef.value.setCapture === 'function')
    rightBarRef.value.setCapture()
  rightBarRef.value.onmouseup = () => {
    rightBarRef.value.releaseCapture()
  }
})
function changeIframeDivStyle(display: string) {
  const iframeDiv = document.getElementsByClassName('iframeDiv')
  iframeDiv[0].style.display = display
}
</script>

<template>
  <div class="p-6 h-full">
    <div class="grid-container">
      <div ref="contentRef" class="left">
        <div ref="iframeRef" class="grid-image">
          <div class="iframeDiv"></div>
          <iframe id="iframe_id" :src="pdfUrl" width="100%" height="100%"></iframe>
        </div>
        <div ref="horizBarRef" class="bar bar-horiz" @mousedown="downHoriz" @mouseup="changeIframeDivStyle('none')">
          <n-icon>
            <MoreHorizRound />
          </n-icon>
        </div>
        <div class="border border-purple-300 px-4 py-2 grid-left-bottom">
          <div class="flex justify-between items-center">
            <p class="font-bold text-lg">
              Summary
            </p>
            <button
              class="py-2 px-3 switch-lang font-medium text-sm" :class="[isEnSummary ? '' : 'px-4']" @click="() => setisEnSummary(!isEnSummary)"
            >
              {{ isEnSummary ? "\u4E2D\u6587" : "EN" }}
            </button>
          </div>
          <div v-html="useMarkdown(summaryResult && (isEnSummary ? summaryResult[renderPage - 1].summary : summaryResult[renderPage - 1].chineseSummary)).value"></div>
        </div>
      </div>
      <div ref="rightBarRef" class="bar bar-vert" @mousedown="downRight">
        <n-icon>
          <MoreVertRound />
        </n-icon>
      </div>
      <div class="flex flex-col flex-1  grid-right">
        <n-tabs v-model:value="name" type="card" tab-style="min-width: 80px;">
          <n-tab-pane v-for="panel in panels" :key="panel.value" :tab="panel.tab" :name="panel.value">
            <div class="h-full flex flex-col justify-between">
              <template v-if="panel.value === 'chat'">
                <AIChat :pdf-id="pdfId" :page-list="summaryResult"></AIChat>
              </template>
              <template v-if="panel.value === 'comment'">
                <div class="w-full overflow-y-auto">
                  <Comment
                    v-for="comment in comments" :key="comment.commentId" :comment="comment" :page-ids="pageIds" class="pr-2"
                    @update-comment="getComment(summaryResult, renderPage)"
                  />
                  {{ }}
                </div>
                <n-input v-model:value="commentContent" round autosize placeholder="评论..." class="mx-5 mb-3 h-11">
                  <template #suffix>
                    <n-icon :component="NorthRound" class="cursor-pointer" @click="addRootComment({ pdfPageId: pageIds[renderPage - 1], comment: commentContent })">
                    </n-icon>
                  </template>
                </n-input>
              </template>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: flex;
  height: 100%;
  position: relative;
}
.left {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.grid-image {
  height: 50%;
  width: 100%;
  position: relative;
}
.iframeDiv {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1111;
    filter: alpha(opacity=0);
    opacity: 0;
    background: transparent;
    user-select: none;
}
.bar{
    display: flex;
    justify-content: center;
    align-items: center;
}
.bar-horiz {
  cursor: row-resize;
}
.bar-vert {
  cursor: col-resize;
}
.grid-left-bottom{
    flex: 1;
    overflow-y: auto;
    border-radius: 25px;
  // &::-webkit-scrollbar {
  //   overflow: hidden;
  // }

}
.grid-right {
  flex: 1;
}
// .grid-container {
//   display: grid;
//   grid-template-columns: 75% 1fr;
//   grid-template-rows: 65% 1fr;
//   height: 100%;
//   width: 100%;
//   gap: 10px;
// }

// .grid-image {
//   width: 100%;
//   grid-column: 1;
//   grid-row: 1;
// }

// .grid-left-bottom {
//   grid-column: 1;
//   grid-row: 2;
//   flex-grow: 1;
//   overflow-y: auto;
//   border-radius: 25px;
//   // &::-webkit-scrollbar {
//   //   overflow: hidden;
//   // }
// }

// .grid-right {
//   grid-column: 2;
//   grid-row: 1 / 3;
//   /* 跨两行 */
// }

.switch-lang {
  background-color: #8454ed8e;
  color: #fff;
  border-radius: 15%;
  &:hover {
    background-color: #8454ed;
  }
}
:deep(.n-tabs-tab__label) {
  color: #000 !important;
  font-size: 16px !important;
}

:deep(.n-tabs-tab) {
  padding: 5px 20px;
  background-color: #fff !important;
  border: none !important;
}

:deep(.n-tabs-tab--active) {
  border-radius: 10px 10px 0 0 !important;
  background-color: #F6F5FC !important;
}

:deep(.n-tab-pane) {
  background-color: #F6F5FC;
  height: 100% !important;
  border-radius: 0 0 25px 25px !important;
}

:deep(.n-tabs) {
  height: 100% !important;
}
</style>
