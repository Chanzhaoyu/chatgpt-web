<script lang="ts" setup>
import { NForm, NFormItem, NSelect, NSlider } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import { useSpeechStore } from '@/store/modules/speech'
import type { VoiceDataType } from '@/components/voice-input/speech-object'
import { useSpeechObject } from '@/components/voice-input/speech-object'

const { isReady, usedVoices } = useSpeechObject()
const speechStore = useSpeechStore()

const formData = ref({ ...speechStore.speechSetting })

const langOptions = computed(() => usedVoices.value.map(item => ({
  label: item.label,
  value: item.lang,
})))

const soundOptions = computed(() => {
  const { lang } = formData.value
  const langOption = usedVoices.value.find(item => item.lang === lang) || { voices: [] }

  return langOption.voices
})

watchEffect(() => {
  const langOption = usedVoices.value.find(item => item.lang === formData.value.lang) || { voices: [], source: {} as VoiceDataType['source'] }

  let sound = formData.value.sound || ''
  if (speechStore.speechSetting.lang !== formData.value.lang) {
    // reset when lang change
    sound = langOption.voices[0].value
    formData.value.sound = sound
  }

  if (isReady) {
    speechStore.updateStore({
      speechSetting: {
        ...formData.value,
        voice: langOption.source[sound],
      },
    })
  }
})
</script>

<script lang="ts">
export default {
  name: 'SpeechSetting',
}
</script>

<template>
  <NForm label-placement="left" size="medium" :model="formData" label-width="100">
    <NFormItem :label="$t('setting.speakLang')" path="lang">
      <NSelect v-model:value="formData.lang" :options="langOptions" />
    </NFormItem>
    <NFormItem :label="$t('setting.speakSound')" path="sound">
      <NSelect v-model:value="formData.sound" :options="soundOptions" />
    </NFormItem>
    <NFormItem :label="$t('setting.pitch')" path="pitch">
      <NSlider v-model:value="formData.pitch" :min="0" :max="2" />
    </NFormItem>
    <NFormItem :label="$t('setting.rate')" path="rate">
      <NSlider v-model:value="formData.rate" :min="0" :max="10" />
    </NFormItem>
  </NForm>
</template>

<style scoped>

</style>
