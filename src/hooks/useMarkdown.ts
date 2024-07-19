import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import MdKatex from '@vscode/markdown-it-katex'
import MdLinkAttributes from 'markdown-it-link-attributes'
import MdMermaid from 'mermaid-it-markdown'
import hljs from 'highlight.js'

export function useMarkdown(text = '') {
  const mdi = new MarkdownIt({
    html: false,
    linkify: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language))
      if (validLang) {
        const lang = language ?? ''
        return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
      }
      return highlightBlock(hljs.highlightAuto(code).value, '')
    },
  })

  mdi.use(MdLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
    .use(MdKatex)
    .use(MdMermaid)

  const renderedMdText = computed(() => {
    // 对数学公式进行处理，自动添加 $$ 符号
    const escapedText = escapeBrackets(escapeDollarNumber(text))
    return mdi.render(escapedText)
  })

  return renderedMdText
}

function escapeDollarNumber(text: string) {
  let escapedText = ''

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i]
    const nextChar = text[i + 1] || ' '

    if (char === '$' && nextChar >= '0' && nextChar <= '9')
      char = '\\$'

    escapedText += char
  }

  return escapedText
}

function escapeBrackets(text: string) {
  const pattern = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g
  return text.replace(pattern, (match, codeBlock, squareBracket, roundBracket) => {
    if (codeBlock)
      return codeBlock
    else if (squareBracket)
      return `$$${squareBracket}$$`
    else if (roundBracket)
      return `$${roundBracket}$`
    return match
  })
}

function highlightBlock(str: string, lang?: string) {
//   return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}
