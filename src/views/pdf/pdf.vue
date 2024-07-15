<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf'
import { NTabPane, NTabs, useMessage } from 'naive-ui'
import Comment from './components/Comment.vue'
import { pdfInfo } from '@/api'
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface PageSummary {
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
const name = ref('chat')
const message = useMessage()
const panels = ref([{ tab: 'AI chat', value: 'chat' }, { tab: '评论区', value: ' comment' }, { tab: 'my star', value: 'star' }])

function getPdfPages() {
  const loadingTask = getDocument(sourceRef.value)
  loadingTask.promise.then((pdf) => {
    // 获取特定页面
    pdf.getPage(3).then((page) => {
      const viewport = page.getViewport({ scale: 1.3 })

      // 准备 canvas 使用 PDF 页面的尺寸
      const canvas = canvasRef.value
      const context = canvas.getContext('2d')
      if (!context)
        return
      canvas.height = viewport.height
      canvas.width = viewport.width

      // 渲染 PDF 页面到 canvas 上
      const renderContext = {
        canvasContext: context,
        viewport,
      }
      const renderTask = page.render(renderContext)
      renderTask.promise.then(() => {
        console.log('Page rendered')
      })
    })
  }, (reason) => {
    console.error(reason)
  })
}
const getPdfInfo = async () => {
  try {
    if (pdfId.value) {
      const res = await pdfInfo<PdfSummary>(pdfId.value)
      if (res.data.pageSummaryList.length) {
        summaryResult.value = res.data.pageSummaryList.map((summary) => {
          return {
            pagePosition: summary.pagePosition,
            summary: summary.summary,
          }
        })
        const originalUrl = res.data.signedUrl
        const apiUrl = originalUrl.replace('https://cuhk-ai.oss-cn-shenzhen.aliyuncs.com', '')
        sourceRef.value = apiUrl
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

onMounted(async () => {
  pdfId.value = route.query.pdfId as string
  await getPdfInfo()
  getPdfPages()
})

function goBack() {
  router.back()
}

const comments = [
  {
    commentId: '1',
    comment: 'It is important!',
    userIconUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    userName: 'Linda',
    createTime: '06-28',
    starCount: '99',
    isStared: false,
    commentVoList: [
      {
        commentId: '2',
        comment: 'I agree',
        userIconUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        userName: 'Tom',
        createTime: '06-28',
        starCount: '12',
        isStared: false,
      },
      {
        commentId: '3',
        comment: 'Good',
        userIconUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        userName: 'Kelly',
        createTime: '06-28',
        starCount: '3',
        isStared: false,
      },
    ],
  },
  {
    commentId: '4',
    comment: 'The Basic expression includes The Basic expression includes The Basic expression includes The Basic expression includes expression includes',
    userIconUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    userName: 'Peter',
    createTime: '06-27',
    starCount: '99',
    isStared: true,
  },
  {
    commentId: '5',
    comment: 'The Basic expression includes The Basic expression includes The Basic expression includes The Basic expression includes expression includes on includes The Basic expression includes expression includes',
    userIconUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    userName: 'Jerrimy',
    createTime: '06-27',
    starCount: '120',
    isStared: false,
  },
]
</script>

<template>
  <div class="p-6 h-full">
    <div class="grid-container">
      <canvas ref="canvasRef" class="shadow-md mt-10 border border-gray-300 grid-image"></canvas>
      <div class="border border-purple-300 p-4 mt-2 grid-left-bottom">
        <p class="mb-4">
          Summary
        </p>
        <p>
          {{ summaryResult && summaryResult[3].summary }}
        </p>
      </div>
      <div class="flex flex-col flex-1 ml-4 grid-right">
        <n-tabs v-model:value="name" type="card" tab-style="min-width: 80px;">
          <n-tab-pane v-for="panel in panels" :key="panel.value" :tab="panel.tab" :name="panel.value">
            <div class="h-full">
              {{ panel.value }}
              <Comment v-for="comment in comments" :key="comment.commentId" :comment="comment" />
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
    grid-template-rows: auto 1fr;
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
