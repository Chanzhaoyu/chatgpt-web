import type { App, Directive } from 'vue'
import hljs from 'highlight.js'

function highlightCode(el: HTMLElement) {
  const regexp = /^(?:\s{4}|\t).+/gm
  if (el.textContent?.indexOf(' = ') !== -1 || el.textContent.match(regexp))
    hljs.highlightBlock(el)
}

export default function setupHighlightDirective(app: App) {
  const highLightDirective: Directive<HTMLElement> = {
    mounted(el: HTMLElement) {
      highlightCode(el)
    },
    updated(el: HTMLElement) {
      highlightCode(el)
    },
  }

  app.directive('highlight', highLightDirective)
}
