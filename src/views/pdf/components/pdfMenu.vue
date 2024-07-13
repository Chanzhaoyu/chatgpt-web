<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const source = '/pdfs/CSC%206042/Part-3%20Data%20Warehouse%20and%20Data%20Mining.pdf?Expires=1720848469&OSSAccessKeyId=LTAI5tL6sjXDXhrBpwSrahUH&Signature=HQh1HinG1mklSwC3mI8Oqy0MPtY%3D'
const numPages = ref(0)

onMounted(() => {
  nextTick(async () => {
    const loadingTask = getDocument(source)
    const pdf = await loadingTask.promise
    numPages.value = pdf._pdfInfo.numPages
    for (let page = 1; page <= pdf._pdfInfo.numPages; page++) {
      const pdfPage = await pdf.getPage(page)
      const viewport = pdfPage.getViewport({ scale: 1 })
      const canvas = document.getElementById(`canvas${page}`) as HTMLCanvasElement
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport,
      }
      await pdfPage.render(renderContext).promise
    }
  })
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="mx-8 mt-6 overflow-y-auto">
    <div class="flex justify-center">
      <div class="container">
        <div v-for="i in numPages" :key="i" class="p-4 flex flex-col items-center">
          <canvas :id="`canvas${i}`" class="w-56"></canvas>
          <p class="text-sm mt-2">
            第{{ i }}页
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    grid-gap: 1rem;
} */
</style>
