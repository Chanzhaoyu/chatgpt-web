<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import { NIcon, NInput, NTabPane, NTabs, useMessage } from 'naive-ui'
import { NorthRound } from '@vicons/material'
import type { CommentType } from './components/Comment.vue'
import Comment from './components/Comment.vue'
import AIChat from './components/AIChat/AIChat.vue'
import { commentRootList, pdfInfo } from '@/api'
import { usePdfStore } from '@/store/modules/pdf'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export interface PageSummary {
  pageId: string
  pagePosition: number
  summary: string
}

interface PdfSummary {
  signedUrl: string
  pageSummaryList: PageSummary[]
}

const route = useRoute()
const router = useRouter()
const pdfId = ref<string>('')
const summaryResult = ref<PageSummary[]>()
const sourceRef = ref<string>('')
// const source = '/pdfs/CSC%206042/Part-3%20Data%20Warehouse%20and%20Data%20Mining.pdf?Expires=1720848469&OSSAccessKeyId=LTAI5tL6sjXDXhrBpwSrahUH&Signature=HQh1HinG1mklSwC3mI8Oqy0MPtY%3D'
// const numPages = ref(0)
const canvasRef = ref(null)
const name = ref('comment')
const message = useMessage()
const pdfStore = usePdfStore()
const panels = ref([{ tab: 'AI chat', value: 'chat' }, { tab: '评论区', value: 'comment' }, { tab: 'my star', value: 'star' }])

const pdfUrl = ref('') // pdf文件地址
const fileUrl = '/pdfjs-4.4.168-dist/web/viewer.html?file=' // pdfjs文件地址
const renderPage = ref(1)
const comments: Ref<CommentType | null> = ref(null)
function getPdfPages(source) {
}
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
          }
        })

        const originalUrl = res.data.signedUrl
        const apiUrl = originalUrl.replace('https://cuhk-ai.oss-cn-shenzhen.aliyuncs.com', '')
        sourceRef.value = apiUrl
        pdfStore.setSourceurl(apiUrl)
        console.log('pdfStore.sourceurl', pdfStore.sourceurl)
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
function formatDate(dateString) {
  const date = new Date(dateString)
  const month = date.getMonth() + 1 // getMonth() 返回的月份从0开始，所以加1
  const day = date.getDate()

  // 使用模板字符串和三元运算符确保月和日始终是两位数字
  return `${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}
const getComment = async (summaryResultVal: PageSummary[], page: number) => {
  try {
    const realPage = page - 1

    if (summaryResultVal.length && page && summaryResultVal[realPage]) {
      const res = await commentRootList<CommentType>(summaryResultVal[realPage].pageId)
      if (res.data) {
        comments.value = res.data.map((ele) => {
          return {
            commentId: ele.comment.commentId,
            comment: ele.comment.comment,
            userIconUrl: ele.comment.userIconUrl,
            userName: ele.comment.userName,
            createTime: ele.comment.createTime,
            starCount: ele.comment.starCount,
            isStared: ele.comment.isStared,
            commentVoList: ele.commentVoList,
          }
        })
      }
      else {
        throw new Error('无有效数据')
      }
    }
  }
  catch (error) {
    console.error('error', error) // 使用 console.error 记录错误
  }
}

onMounted(async () => {
  window.addEventListener('message', (event) => {
    if (event.data.type === 'pagechange')
      console.log('当前PDF页码为:', event.data.pageNumber)
  })
  const iFrame = document.getElementById('iframe_id')

  pdfId.value = route.query.pdfId as string
  await getPdfInfo()
  // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
  // 核心就是将 iframe 的 src 属性设置为 pdfjs 的地址，然后将 pdf 文件的地址作为参数传递给 pdfjs
  // 例如：http://localhost:8080/pdfjs-4.0.189-dist/web/viewer.html?file=http%3A%2F%2Flocalhost%3A8080%2Fpdf%2Ftest.pdf
  pdfUrl.value = `${fileUrl + encodeURIComponent(sourceRef.value)}#page=${renderPage.value}`
  if (summaryResult.value)
    getComment(summaryResult.value, renderPage.value)
  setTimeout(() => {
    if (iFrame.contentWindow)
      console.log(iFrame.contentWindow.PDFViewerApplication.pdfViewer.currentPageNumber)
  }, 5000)

  //   getPdfPages(sourceRef.value)
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
      console.log(`当前页面: ${pageNumber}`)
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
}, 5000)

watch(() => pdfStore.currentPage, (newPage) => {
  pdfUrl.value = `${fileUrl + encodeURIComponent(sourceRef.value)}#page=${newPage}`
  renderPage.value = newPage
  if (summaryResult.value)
    getComment(summaryResult.value, newPage)
})

function goBack() {
  router.back()
}
</script>

<template>
  <div class="p-6 h-full">
    <div class="grid-container">
      <iframe id="iframe_id" :src="pdfUrl" width="100%" height="100%" class="grid-image"></iframe>
      <!-- <canvas ref="canvasRef" class="shadow-md mt-10 border border-gray-300 grid-image"></canvas> -->
      <div class="border border-purple-300 p-4 mt-2 grid-left-bottom">
        <p class="mb-4">
          Summary
        </p>
        <p>
          {{ summaryResult && summaryResult[renderPage - 1].summary }}
        </p>
      </div>
      <div class="flex flex-col flex-1 ml-4 grid-right">
        <n-tabs v-model:value="name" type="card" tab-style="min-width: 80px;">
          <n-tab-pane v-for="panel in panels" :key="panel.value" :tab="panel.tab" :name="panel.value">
            <div class="h-full flex flex-col justify-between">
              <template v-if="panel.value === 'chat'">
                <AIChat :pdf-id="pdfId" :page-list="summaryResult"></AIChat>
              </template>
              <template v-if="panel.value === 'comment'">
                <div>
                  <Comment
                    v-for="comment in comments" :key="comment.commentId" :comment="comment" class="pr-2"
                    @update-comment="getComment(summaryResult, renderPage)"
                  />
                  {{ }}
                </div>
                <n-input round autosize placeholder="评论..." class="mx-5 my-3 h-11">
                  <template #suffix>
                    <n-icon :component="NorthRound" class="cursor-pointer">
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

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  grid-gap: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: 65% 1fr;
  grid-template-rows: 65% 1fr;
  height: 100%;
  width: 100%;
  gap: 10px;
}

.left {
  display: flex;
  flex-direction: column;
}

.grid-image {
  width: 100%;
  grid-column: 1;
  grid-row: 1;
}

.grid-left-bottom {
  grid-column: 1;
  grid-row: 2;
  flex-grow: 1;
  overflow-y: auto;
  border-radius: 25px;
}

.grid-right {
  grid-column: 2;
  grid-row: 1 / 3;
  /* 跨两行 */
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
