// 转义 HTML 字符
export function encodeHTML(source: string) {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 判断是否为代码块
export function includeCode(text: string | null | undefined) {
  const regexp = /^(?:\s{4}|\t).+/gm
  return !!(text?.includes(' = ') || text?.match(regexp))
}

// 复制文本
export function copyText(text: string) {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', text)
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy'))
    document.execCommand('copy')
  document.body.removeChild(input)
}
