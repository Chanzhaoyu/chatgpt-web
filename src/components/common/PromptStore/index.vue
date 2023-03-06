<script setup lang='ts'>
import { computed, h, ref, watch } from 'vue'
import { NButton, NButtonGroup, NCard, NDataTable, NDivider, NGi, NGrid, NIcon, NInput, NLayoutContent, NMessageProvider, NModal, NPopconfirm, NSpace, NTabPane, NTabs, useMessage } from 'naive-ui'
import PromptRecommend from '../../../assets/recommend.json'
import { usePromptStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const message = useMessage()
const showModal = ref(false)
// 移动端自适应相关
const { isMobile } = useBasicLayout()

const promptStore = usePromptStore()
// Prompt在线导入推荐List,根据部署者喜好进行修改(assets/recommend.json)
const promptRecommendList = PromptRecommend
const promptList = ref<any>(promptStore.promptList)
// 用于添加修改的临时prompt参数
const tempPromptKey = ref('')
const tempPromptValue = ref('')
// Modal模式，根据不同模式渲染不同的Modal内容
const modalMode = ref('')
// 这个是为了后期的修改Prompt内容考虑，因为要针对无uuid的list进行修改，且考虑到不能出现标题和内容的冲突，所以就需要一个临时item来记录一下
const tempModifiedItem = ref<any>({})
// 添加修改导入都使用一个Modal, 临时修改内容占用tempPromptKey,切换状态前先将内容都清楚
const changeShowModal = (mode: string, selected = { key: '', value: '' }) => {
  if (mode === 'add') {
    tempPromptKey.value = ''
    tempPromptValue.value = ''
  }
  else if (mode === 'modify') {
    tempModifiedItem.value = { ...selected }
    tempPromptKey.value = selected.key
    tempPromptValue.value = selected.value
  }
  else if (mode === 'local_import') {
    tempPromptKey.value = 'local_import'
    tempPromptValue.value = ''
  }
  showModal.value = !showModal.value
  modalMode.value = mode
}
// 在线导入相关
const downloadURL = ref('')
const downloadDisabled = computed(() => downloadURL.value.trim().length < 1)
const setDownloadURL = (url: string) => {
  downloadURL.value = url
}
// 控制inut按钮
const inputStatus = computed (() => tempPromptKey.value.trim().length < 1 || tempPromptValue.value.trim().length < 1)
// Prompt模板相关操作
const addPromptTemplate = () => {
  for (const i of promptList.value) {
    if (i.key === tempPromptKey.value) {
      message.error('已存在重复标题,请重新输入')
      return
    }
    if (i.value === tempPromptValue.value) {
      message.error(`已存在重复内容:${tempPromptKey.value},请重新输入`)
      return
    }
  }
  promptList.value.unshift({ key: tempPromptKey.value, value: tempPromptValue.value } as never)
  message.success('添加prompt成功')
  changeShowModal('')
}
const modifyPromptTemplate = () => {
  let index = 0
  // 通过临时索引把待修改项摘出来
  for (const i of promptList.value) {
    if (i.key === tempModifiedItem.value.key && i.value === tempModifiedItem.value.value)
      break
    index = index + 1
  }
  const tempList = promptList.value.filter((_: any, i: number) => i !== index)
  // 搜索有冲突的部分
  for (const i of tempList) {
    if (i.key === tempPromptKey.value) {
      message.error('检测修改Prompt标题冲突，请重新修改')
      return
    }
    if (i.value === tempPromptValue.value) {
      message.error(`检测修改内容${i.key}冲突，请重新修改`)
      return
    }
  }
  promptList.value = [{ key: tempPromptKey.value, value: tempPromptValue.value }, ...tempList] as never
  message.success('Prompt信息修改成功')
  changeShowModal('')
}
const deletePromptTemplate = (row: { key: string; value: string }) => {
  promptList.value = [...promptList.value.filter((item: { key: string; value: string }) => item.key !== row.key)] as never
  message.success('删除Prompt成功')
}
const clearPromptTemplate = () => {
  promptList.value = []
  message.success('清空Prompt成功')
}
const importPromptTemplate = () => {
  try {
    const jsonData = JSON.parse(tempPromptValue.value)
    for (const i of jsonData) {
      let safe = true
      for (const j of promptList.value) {
        if (j.key === i.key) {
          message.warning(`因标题重复跳过:${i.key}`)
          safe = false
          break
        }
        if (j.value === i.value) {
          message.warning(`因内容重复跳过:${i.key}`)
          safe = false
          break
        }
      }
      if (safe)
        promptList.value.unshift({ key: i.key, value: i.value } as never)
    }
    message.success('导入成功')
    changeShowModal('')
  }
  catch {
    message.error('JSON格式错误,请检查JSON格式')
    changeShowModal('')
  }
}
// 模板导出
const exportPromptTemplate = () => {
  const jsonDataStr = JSON.stringify(promptList.value)
  const blob = new Blob([jsonDataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ChatGPTPromptTemplate.json'
  link.click()
  URL.revokeObjectURL(url)
}
// 模板在线导入
const downloadPromptTemplate = async () => {
  try {
    await fetch(downloadURL.value)
      .then(response => response.json())
      .then((jsonData) => {
        tempPromptValue.value = JSON.stringify(jsonData)
      }).then(() => {
        importPromptTemplate()
      })
  }
  catch {
    message.error('网络导入出现问题,请检查网络状态与JSON文件有效性')
  }
}
// 移动端自适应相关
const renderTemplate = () => {
  const [keyLimit, valueLimit] = isMobile.value ? [6, 9] : [15, 50]

  return promptList.value.map((item: { key: string; value: string }) => {
    return {
      renderKey: item.key.length <= keyLimit ? item.key : `${item.key.substring(0, keyLimit)}...`,
      renderValue: item.value.length <= valueLimit ? item.value : `${item.value.substring(0, valueLimit)}...`,
      key: item.key,
      value: item.value,
    }
  })
}
const pagination = computed(() => {
  const [pageSize, pageSlot] = isMobile.value ? [6, 5] : [7, 15]
  return {
    pageSize, pageSlot,
  }
})
// table相关
const createColumns = (
) => {
  return [
    {
      title: '标题',
      key: 'renderKey',
    },
    {
      title: '内容',
      key: 'renderValue',
    },
    {
      title: '操作',
      key: 'actions',
      render(row: { key: string; value: string }) {
        return h(NButtonGroup, { vertical: true }, {
          default: () => [h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => changeShowModal('modify', row),
            },
            { default: () => '修改' },
          ),
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => deletePromptTemplate(row),
            },
            { default: () => '删除' },
          ),
          ],
        })
      },
    },
  ]
}
const columns = createColumns()

watch(() => promptList, () => {
  promptStore.updatePromptList(promptList.value)
}, { deep: true })
</script>

<template>
  <NMessageProvider>
    <NModal v-model:show="show" style="width: 80%; max-width: 900px;">
      <NCard>
        <div class="space-y-4">
          <NTabs type="segment">
            <NTabPane name="local" tab="本地管理">
              <NSpace justify="end">
                <NButton strong secondary type="default" @click="changeShowModal('add')">
                  添加
                </NButton>
                <NButton strong secondary type="default" @click="changeShowModal('local_import')">
                  导入
                </NButton>
                <NButton strong secondary type="default" @click="exportPromptTemplate()">
                  导出
                </NButton>
                <NPopconfirm
                  @positive-click="clearPromptTemplate"
                >
                  <template #trigger>
                    <NButton strong secondary type="default">
                      清空
                    </NButton>
                  </template>
                  确认是否清空数据?
                </NPopconfirm>
              </NSpace>
              <br>
              <NDataTable
                :columns="columns"
                :data="renderTemplate()"
                :pagination="pagination"
                :bordered="false"
              />
            </NTabPane>
            <NTabPane name="download" tab="在线导入">
              注意：请检查下载JSON文件来源，恶意的JSON文件可能会破坏您的计算机!!!<br><br>
              <NGrid x-gap="12" y-gap="12" :cols="24">
                <NGi :span="isMobile ? 18 : 22">
                  <NInput v-model:value="downloadURL" placeholder="请输入正确的JSON地址" />
                </NGi>
                <NGi>
                  <NButton strong secondary :disabled="downloadDisabled" @click="downloadPromptTemplate()">
                    下载
                  </NButton>
                </NGi>
              </NGrid>
              <NDivider />
              <NLayoutContent v-if="isMobile" style="height: 360px" content-style=" background:none;" :native-scrollbar="false">
                <NCard v-for="info in promptRecommendList" :key="info.key" :title="info.key" style="margin: 5px;" embedded :bordered="true">
                  {{ info.desc }}
                  <template #footer>
                    <NSpace justify="end">
                      <NButton text style="font-size: 24px">
                        <a
                          :href="info.url"
                          target="_blank"
                        ><NIcon>
                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8c-1.1-1.3-2.1-2.5-3.2-3.7c-.4-.5-.8-.9-1.2-1.4l-4.1-4.7l-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1l-4.8-4.8l-.3-.3c-1.5-1.5-3-2.9-4.5-4.3c-.5-.5-1-1-1.6-1.5c-1-1-2-1.9-3-2.8c-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1c-1 .9-2 1.9-3 2.9c-.5.5-1 1-1.6 1.5c-1.5 1.4-3 2.9-4.5 4.3l-.3.3l-4.8 4.8l-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7c-.4.5-.8.9-1.2 1.4c-1.1 1.2-2.1 2.5-3.2 3.7c-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2c1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6c80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0 0 10-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5c0-.1.1-.1.1-.2c1.4-1.5 2.8-3.1 4.1-4.7c.4-.5.8-.9 1.2-1.4a99 99 0 0 0 3.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 0 0-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6c29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 0 1 887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 0 1-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4c3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 0 1 115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8c-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 0 1 540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4c21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 0 0 540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4c-21.2-16.7-41.7-42.7-59.1-75.1c-11-20.6-20.7-43.3-29-67.8c37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 0 1-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8c17.4-32.4 37.8-58.4 59.1-75.1c9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4c-23.4 31.3-43.5 70.4-59.2 115.4c-21-12-40.9-26-59.4-41.8c31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2c24.9 21.5 52.2 40.3 81.5 55.9c-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 0 0-81.5 55.9A373.86 373.86 0 0 1 137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2c18.5-15.8 38.4-29.7 59.4-41.8c15.7 45 35.8 84.1 59.2 115.4c-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4c23.4-31.3 43.5-70.4 59.2-115.4c21 12 40.9 26 59.4 41.8a373.81 373.81 0 0 1-107.6 69.2z" fill="currentColor" /></svg>
                        </NIcon>
                        </a>
                      </NButton>
                      <NButton text style="font-size: 24px" @click="setDownloadURL(info.downloadUrl) ">
                        <NIcon>
                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288" /><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M400 256H112" /></svg>
                        </NIcon>
                      </NButton>
                    </NSpace>
                  </template>
                </NCard>
              </NLayoutContent>
              <NLayoutContent v-else style="height: 360px" content-style="padding: 10px; background:none;" :native-scrollbar="false">
                <NGrid x-gap="12" y-gap="12" :cols="isMobile ? 1 : 3">
                  <NGi v-for="info in promptRecommendList" :key="info.key">
                    <NCard :title="info.key" embedded :bordered="true">
                      {{ info.desc }}
                      <template #footer>
                        <NSpace justify="end">
                          <NButton text style="font-size: 24px">
                            <a
                              :href="info.url"
                              target="_blank"
                            ><NIcon>
                              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8c-1.1-1.3-2.1-2.5-3.2-3.7c-.4-.5-.8-.9-1.2-1.4l-4.1-4.7l-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1l-4.8-4.8l-.3-.3c-1.5-1.5-3-2.9-4.5-4.3c-.5-.5-1-1-1.6-1.5c-1-1-2-1.9-3-2.8c-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1c-1 .9-2 1.9-3 2.9c-.5.5-1 1-1.6 1.5c-1.5 1.4-3 2.9-4.5 4.3l-.3.3l-4.8 4.8l-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7c-.4.5-.8.9-1.2 1.4c-1.1 1.2-2.1 2.5-3.2 3.7c-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2c1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6c80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0 0 10-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5c0-.1.1-.1.1-.2c1.4-1.5 2.8-3.1 4.1-4.7c.4-.5.8-.9 1.2-1.4a99 99 0 0 0 3.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 0 0-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6c29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 0 1 887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 0 1-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4c3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 0 1 115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8c-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 0 1 540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4c21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 0 0 540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4c-21.2-16.7-41.7-42.7-59.1-75.1c-11-20.6-20.7-43.3-29-67.8c37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 0 1-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8c17.4-32.4 37.8-58.4 59.1-75.1c9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4c-23.4 31.3-43.5 70.4-59.2 115.4c-21-12-40.9-26-59.4-41.8c31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2c24.9 21.5 52.2 40.3 81.5 55.9c-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 0 0-81.5 55.9A373.86 373.86 0 0 1 137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2c18.5-15.8 38.4-29.7 59.4-41.8c15.7 45 35.8 84.1 59.2 115.4c-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4c23.4-31.3 43.5-70.4 59.2-115.4c21 12 40.9 26 59.4 41.8a373.81 373.81 0 0 1-107.6 69.2z" fill="currentColor" /></svg>
                            </NIcon>
                            </a>
                          </NButton>
                          <NButton text style="font-size: 24px" @click="setDownloadURL(info.downloadUrl) ">
                            <NIcon>
                              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288" /><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M400 256H112" /></svg>
                            </NIcon>
                          </NButton>
                        </NSpace>
                      </template>
                    </NCard>
                  </NGi>
                </NGrid>
              </NLayoutContent>
            </NTabPane>
          </NTabs>
        </div>
      </NCard>
    </NModal>
    <NModal v-model:show="showModal">
      <NCard
        style="width: 600px"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <NSpace v-if="modalMode === 'add' || modalMode === 'modify'" vertical>
          模板标题
          <NInput v-model:value="tempPromptKey" placeholder="搜索" />
          模板内容
          <NInput v-model:value="tempPromptValue" placeholder="搜索" type="textarea" />
          <NButton strong secondary :style="{ width: '100%' }" :disabled="inputStatus" @click="() => { modalMode === 'add' ? addPromptTemplate() : modifyPromptTemplate() }">
            确定
          </NButton>
        </NSpace>
        <NSpace v-if="modalMode === 'local_import'" vertical>
          <NInput v-model:value="tempPromptValue" placeholder="请粘贴json文件内容" :autosize="{ minRows: 3, maxRows: 15 }" type="textarea" />
          <NButton strong secondary :style="{ width: '100%' }" :disabled="inputStatus" @click="() => { importPromptTemplate() }">
            导入
          </NButton>
        </NSpace>
      </NCard>
    </NModal>
  </NMessageProvider>
</template>
