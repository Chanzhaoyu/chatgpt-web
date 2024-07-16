<script lang="ts" setup>
import { ref, watch } from 'vue'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf'
import { usePdfStore } from '@/store'
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const source = '/pdfs/CSC%206042/Part-3%20Data%20Warehouse%20and%20Data%20Mining.pdf?Expires=1720848469&OSSAccessKeyId=LTAI5tL6sjXDXhrBpwSrahUH&Signature=HQh1HinG1mklSwC3mI8Oqy0MPtY%3D'
const numPages = ref(0)
const pdfStore = usePdfStore()
const activePage = ref(1)
watch(() => pdfStore.sourceUrl, getPdfPage)
watch(() => pdfStore.currentPage, (newPage) => {
  activePage.value = newPage
})

async function getPdfPage() {
  console.log('sourceRef.value', pdfStore.sourceUrl)

  const loadingTask = getDocument(pdfStore.sourceUrl)
  const pdf = await loadingTask.promise
  numPages.value = Number(pdf._pdfInfo.numPages)
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
}
const changeActivePage = (page: number) => {
  activePage.value = page
  pdfStore.setCurrentPage(page)
}
</script>

<template>
  <div class="mx-8 mt-6 overflow-y-auto">
    <div class="flex justify-center">
      <div class="container">
        <div v-for="i in numPages" :key="i" class="p-4 flex flex-col items-center">
          <canvas :id="`canvas${i}`" class="w-48 cursor-pointer page-item" :class="[activePage === i ? 'active-page' : '']" @click="changeActivePage(i)"></canvas>
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
 .page-item {
  box-sizing: border-box;
  border: 4px solid transparent
 }
 .active-page {
  border-color:  #8CC1FF;
 }
</style>
