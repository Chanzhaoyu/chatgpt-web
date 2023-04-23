/**
 * @create 2023-03-19
 * @desc utils
 */
import type { Ref } from 'vue'
interface replaceMapItem {
  symbol: string
  enSymbol: string
  terms: string[]
}
export const enum commandType {
  clear = 'clear',
  deleteLast = 'deleteLast',
  reset = 'reset',
  submit = 'submit',
  stop = 'stop',
  switchLang = 'switchLang',
}

const replaceMap: replaceMapItem[] = [
  { symbol: '，', enSymbol: ',', terms: ['逗号', 'comma', '逗號'] },
  { symbol: '。', enSymbol: '.', terms: ['句号', 'full stop', '句號'] },
  { symbol: '？', enSymbol: '?', terms: ['问号', 'question mark', '問號'] },
  { symbol: '：', enSymbol: ':', terms: ['冒号', 'colon '] },
  { symbol: '！', enSymbol: '!', terms: ['感叹号', '叹号', 'exclamatory mark', '感嘆號'] },
  { symbol: '\r\n', enSymbol: '\r\n', terms: ['换行', '回车', 'newline'] },
  { symbol: '.', enSymbol: '.', terms: ['点', 'dot'] },
  { symbol: ' ', enSymbol: ' ', terms: ['空格', 'space'] },
]

const langMap: Record<string, string[]> = {
  'zh-CN': ['切换中文', '切换汉语', '切换普通话', 'switch chinese'],
  'en-US': ['切换英语', '切换英文', 'switch english'],
  'zh-HK': ['切换粤语', '切换白话'],
}

const sentenceFlag = ['\r\n', '.', '。', '!', '！', '?', '？']
const commandTermMap: Record<commandType, string[]> = {
  [commandType.clear]: ['清除', '清空', 'clear', 'clean'],
  [commandType.deleteLast]: ['删除', '撤销', '回退', 'delete', 'revert'],
  [commandType.reset]: ['重置', 'reset'],
  [commandType.submit]: ['发送', '提交', '起飞', 'run', 'go', 'start', 'send', '發送'],
  [commandType.stop]: ['停止语音', '关闭语音', 'stop', '關閉語音'],
  [commandType.switchLang]: Object.keys(langMap).map(key => langMap[key]).flat(),
}

export const replaceSymbol = (str: string, en = false) => {
  let resStr = str
  replaceMap.forEach((item) => {
    const fuhao = en ? item.enSymbol : item.symbol

    item.terms.forEach((term) => {
      const regex = new RegExp(`${term}`, 'ig')
      resStr = resStr.replace(regex, fuhao)
    })
  })

  return resStr
}

const repalceFn = (str: string, terms: string[], replaceStr = '') => {
  for (const term of terms) {
    const regex = new RegExp(`${term}`, 'ig')

    if (regex.test(str)) {
      return {
        hasKey: true,
        str: str.replace(regex, replaceStr),
      }
    }
  }

  return {
    hasKey: false,
    str,
  }
}

// 1. 找到语音对应的操作
// 2. 将关键词去掉，不用输出
export const getCmdKey = (str: string) => {
  for (const item in commandTermMap) {
    const res = repalceFn(str, commandTermMap[item as unknown as commandType], '')
    if (res.hasKey) {
      return {
        ...res,
        cmdKey: item as unknown as commandType,
      }
    }
  }
}

type CommandFunType = (options: {
  str: string
  sentences: Ref<string[]>
  callback?: (type: commandType, data: string[]) => void
}) => void

const findLastIndex = <T>(arr: T[], callback: (item: T, index: number) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (callback(arr[i], i))
      return i
  }

  return -1
}
export const deleteLast: CommandFunType = ({ sentences, callback }) => {
  if (!sentences?.value)
    return

  // 先把 删除 的这一句值为空
  sentences.value[sentences.value.length - 1] = ''

  // 从后往前找到一个不为空的 index
  const deleteIndex = findLastIndex<string>(sentences.value, item => item !== '')
  if (deleteIndex !== -1) {
    const lastSentences = sentences.value[deleteIndex]
    let flagLastIndex = -1
    sentenceFlag.forEach((flag) => {
      if (flagLastIndex === -1 && lastSentences.lastIndexOf(flag))
        flagLastIndex = lastSentences.lastIndexOf(flag)
    })

    if (flagLastIndex !== -1)
      sentences.value[deleteIndex] = lastSentences.substring(0, flagLastIndex)
    else
      sentences.value[deleteIndex] = ''
  }

  callback?.(commandType.deleteLast, sentences.value)
}

export const getLanguage = (str = '') => {
  for (const lang in langMap) {
    const token = langMap[lang]
    const hasLang = token?.some(item => str.includes(item))

    if (hasLang)
      return lang
  }
}

export const emptySentences = (arr: Ref<string[]>) => {
  arr.value = Array(arr.value.length).fill('')
}
export const logger = (...msg: string[]) => {
  // eslint-disable-next-line no-console
  console.log('*** speech', ...msg)
}

export const tips = [
  { label: '删除', value: '当说出"删除"，"回退"，"delete"等指令时，会删除最近的一句话' },
  { label: '清空', value: '当说出"清除"，"清空"，"clean"等指令时，会清空整个输入框' },
  { label: '重置', value: '当说出"reset"，"重置"等指令时，相当于右上角的删除按钮' },
  { label: '提交', value: '当说出"发送"，"起飞"，"發送"，"send"等指令时，会发送输入框的内容' },
  { label: '停止', value: '当说出"停止语音"，"关闭语音"，"stop"等指令时，会删除最近的一句话' },
  { label: '标点符号', value: '当说出"逗号"，"问号"，"回车"，"空格"，"感叹号"，"句号"等指令时，会用标点符号代替文字输出' },
  { label: '切换语言模式', value: '支持切换输入的语言模式，当前支持："切换中文"，"切换英文"，"切换粤语"，"switch chinese"， "switch english"' },
]
