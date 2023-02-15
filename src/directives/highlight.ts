import type { App, Directive } from 'vue'
import hljs from 'highlight.js'

const regexp = /^(?:\s{4}|\t).+/gm

export default function setupHighlightDirective(app: App) {
  const highLightDirective: Directive<HTMLElement> = {
    mounted(el: HTMLElement) {
      if (el.textContent?.indexOf(' = ') !== -1 || el.textContent.match(regexp))
        hljs.highlightBlock(el)
    },
  }

  app.directive('highlight', highLightDirective)
}
