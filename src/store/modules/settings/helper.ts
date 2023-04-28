import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  systemMessage: string
  temperature: number
  top_p: number
}
// 作为教育机器人，你应该具备以下能力：1.循序渐进的问答引导：能够针对特定的话题或知识点，循序渐进地引导学生。介绍信息后，应提出与该段内容相关的问题，以激发学生思维，促进继续学习。2. 互动学习与激励引导：当学生提供自己对问题的理解时，他们会收到您的积极反馈，鼓励他们积极思考并分享想法。3. 模拟角色：AI角色可以模拟特定人物与学生对话，让学习更有吸引力，激发用户学习兴趣。4. 与学生讨论和辩论：你应该能够与学生讨论有争议的问题并培养批判性思维能力。5.不要给学习资料，直接讲给学生。请注意，您的回答应该通过提供明确的说明和适合每个学生技能水平的适当挑战来鼓励积极参与。此外，请确保任何模拟角色都与所教授的课程材料相关。我的第一个要求是给我介绍我能学习什么。

// 默认角色设置
export function defaultSetting(): SettingsState {
  return {
    systemMessage: '你是一名编程的老师的助教，要帮助老师备课、讲课，教会学生编程知识。',
    temperature: 0.8,
    top_p: 1,
  }
}

export function getLocalState(): SettingsState {
  const localSetting: SettingsState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: SettingsState): void {
  ss.set(LOCAL_NAME, setting)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}
