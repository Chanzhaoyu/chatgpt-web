<!-- eslint-disable vue/no-lone-template -->
<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
import { createLoadingTask } from 'vue3-pdfjs/esm' // 获取总页数

import { computed, onMounted, reactive } from 'vue'

const title = '标题'
const source = 'http://oss-cdn.hcolor.pro/assets/pdf/1.pdf'

const state = reactive({
  source, // 预览pdf文件地址
  pageNum: 1, // 当前页码
  scale: 1, // 缩放比例
  numPages: 0, // 总页数
})

const scale = computed(() => `transform:scale(${state.scale})`)

const setPage = (page: number) => {
  if (page > 0 && state.pageNum < state.numPages) {
    state.pageNum++
  }
  else {
    if (state.pageNum > 1)
      state.pageNum--
  }
}

const setZoom = (val: number) => {
  if (val > 0 && state.scale < 2) {
    state.scale += 0.1
  }
  else {
    if (state.scale > 0.6)
      state.scale -= 0.1
  }
}

onMounted(() => {
  const loadingTask = createLoadingTask(state.source)
  loadingTask.promise.then((pdf: { numPages: number }) => {
    state.numPages = pdf.numPages
  })
})
</script>

<template>
  <div class="pdf-header">
    <p class="title">
      {{ title }}
    </p>
    <div class="page-tool">
      <div class="page-tool-item" @click="setPage(-1)">
        上一页
      </div>
      <div class="page-tool-item">
        {{ state.pageNum }}/{{ state.numPages }}
      </div>
      <div class="page-tool-item" @click="setPage(1)">
        下一页
      </div>
      <div class="page-tool-item" @click="setZoom(0.1)">
        放大
      </div>
      <div class="page-tool-item" @click="setZoom(-0.1)">
        缩小
      </div>
    </div>
  </div>
  <div class="pdf-container">
    <div class="container-left">
      <div v-for="(i, index) in state.numPages" :key="index" class="catalogue-item">
        <div :class="i === state.pageNum ? 'active' : ''">
          <VuePdfEmbed class="item-pdf" :source="state.source" :page="i" @click="state.pageNum = i" />
        </div>
        <p>{{ i }}</p>
      </div>
    </div>
    <div class="container-right">
      <div class="paper-pdf-container">
        <VuePdfEmbed class="paper-pdf" :source="state.source" style="scale" :page="state.pageNum" />
      </div>
    </div>
  </div>

  <!-- <div id="vue-pdf-view">
    <div
      id="page-view" :style="{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%,-50%) scale(${scaleData})`,
        width: '100%',
        height: `${pageHeight}`,
      }"
    >
      <vue-pdf-embed v-show="onlyPage" ref="vuePdfRef" :source="pdfState.url" :page="pdfState.pageNum" text-layer />
      <vue-pdf-embed v-for="page in pdfState.numPages" v-if="manyPage" :key="page" :source="pdfState.url" :page="page" text-layer />
    </div>
  </div>

  <span>
    <button v-show="manyPage" @click="changePageMode">多页</button>
    <button v-show="onlyPage" @click="changePageMode">单页</button>
  </span>

  <br>
  <button @click="pageUp">
    上一页
  </button>
  <button @click="pageDown">
    下一页
  </button>
  <br>
  <button @click="zoomIn">
    放大
  </button>
  <button @click="zoomOut">
    缩小
  </button> -->
</template>

<style scoped lang="less">
body {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.pdf-header {
  width: 100%;
  height: 60px;
  position: fixed;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  padding: 0 20px;
  min-width: 1200px;
  background-color: #323639;
  -webkit-box-shadow: 0px 0px 3px 3px #c8c8c8;
  -moz-box-shadow: 0px 0px 3px 3px #c8c8c8;
  box-shadow: 0px 0px 3px 3px #c8c8c8;
  .title {
  font-size: 18px;
  color: #fff;
  }

  .page-tool {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #fff;
    user-select: none;
    .page-tool-item {
      padding: 8px 15px;
      padding-left: 10px;
      cursor: pointer;
    }
  }

}
.pdf-container {
  display: flex;
  margin: 0 auto;
  padding-top: 60px;
  min-height: calc(100vh - 60px);
  .container-left {
    width: 300px;
    box-sizing: border-box;
    height: calc(100vh - 60px);
    overflow-y: auto;
    background-color: #323639;
    .catalogue-item {
      width: 200px;
      margin: 10px auto;
      text-align: center;
      cursor: pointer;
      p {
        margin: 0;
        padding: 10px 0;
        color: #fff;
      }
      .item-pdf {
        box-sizing: border-box;
        width: 190px;
      }

      .active {
        border: 5px solid #7d9dfe;
      }
    }
  }
  .container-right {
    flex: 1;
    height: calc(100vh - 60px);
    background-color: #505050;
    overflow: hidden;
    .paper-pdf-container {
      width: 100%;
      height: 100%;
      overflow: auto;
      .paper-pdf {
        padding: 50px 0;
        width: 800px;
        margin: 0 auto;
      }
    }
  }
}
</style>
