import { ss } from '@/utils/storage'

const LOCAL_NAME = 'promptStore'

const defaultPromptList = [
  {
    key: '充当歌曲推荐人',
    value: '我想让你担任歌曲推荐人。我将为您提供一首歌曲，您将创建一个包含 10 首与给定歌曲相似的歌曲的播放列表。您将为播放列表提供播放列表名称和描述。不要选择同名或同名歌手的歌曲。不要写任何解释或其他文字，只需回复播放列表名称、描述和歌曲。我的第一首歌是“一路生花 - 温奕心”。',
  },
  {
    key: '充当花哨的标题生成器',
    value: '我想让你充当一个花哨的标题生成器。我会用逗号输入关键字，你会用花哨的标题回复10个标题。我的关键字是 慧抖销，智能创作，排名优化，快速获客',
  },
  {
    key: '充当虚拟医生',
    value: '我想让你扮演虚拟医生。我会描述我的症状，你会提供诊断和治疗方案。只回复你的诊疗方案，其他不回复。不要写解释。我的第一个请求是“每天早上起来鼻子一直流鼻涕很痒”。',
  },
]
interface Prompt {
  key: string
  value: string
}

export interface PromptStore {
  promptList: Array<Prompt>
}

export function getLocalPromptList(): PromptStore {
  const promptStore: PromptStore = ss.get(LOCAL_NAME) ?? { promptList: [] }
  if (!promptStore?.promptList?.length)
    promptStore.promptList = defaultPromptList
  return promptStore
}

export function setLocalPromptList(promptStore: PromptStore): void {
  ss.set(LOCAL_NAME, promptStore)
}
