<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import Advanced from './Advanced.vue'
import Statistics from './Statistics.vue'
import About from './About.vue'
import Site from './Site.vue'
import Mail from './Mail.vue'
import Audit from './Audit.vue'
import User from './User.vue'
import { SvgIcon } from '@/components/common'
import { useAuthStore, useUserStore } from '@/store'

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const userStore = useUserStore()
const authStore = useAuthStore()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const active = ref('General')

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 80%;">
    <div>
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General />
          </div>
        </NTabPane>
        <NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:equalizer-line" />
            <span class="ml-2">{{ $t('setting.advanced') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Advanced />
          </div>
        </NTabPane>
        <NTabPane name="Statistics" tab="Statistics">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:bar-chart-box-line" />
            <span class="ml-2">{{ $t('setting.statistics') }}</span>
          </template>
          <div class="min-h-[100px]">
            <Statistics />
          </div>
        </NTabPane>
        <NTabPane v-if="userStore.userInfo.root" name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <span class="ml-2">{{ $t('setting.config') }}</span>
          </template>
          <About />
        </NTabPane>
        <NTabPane v-if="userStore.userInfo.root" name="SiteConfig" tab="SiteConfig">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:settings-line" />
            <span class="ml-2">{{ $t('setting.siteConfig') }}</span>
          </template>
          <Site />
        </NTabPane>
        <NTabPane v-if="userStore.userInfo.root" name="MailConfig" tab="MailConfig">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:mail-line" />
            <span class="ml-2">{{ $t('setting.mailConfig') }}</span>
          </template>
          <Mail />
        </NTabPane>
        <NTabPane v-if="userStore.userInfo.root" name="AuditConfig" tab="AuditConfig">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:settings-line" />
            <span class="ml-2">{{ $t('setting.auditConfig') }}</span>
          </template>
          <Audit />
        </NTabPane>
        <NTabPane v-if="userStore.userInfo.root" name="UserConfig" tab="UserConfig">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri-user-5-line" />
            <span class="ml-2">{{ $t('setting.userConfig') }}</span>
          </template>
          <User />
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>
