import copy from 'copy-text-to-clipboard'
import type { App } from 'vue'
import copyBtnIcon from '@/icons/copy-btn.svg'
import { t } from '@/locales'

export default function install(app: App) {
  app.directive('copy', {
    beforeMount(el: HTMLElement) {
      // @ts-expect-error for save handler
      el._destroyCopy = {}

      // @ts-expect-error for reuse
      el._init = function () {
        const codeEles = el.querySelectorAll('pre')
        if (codeEles.length === 0)
          return

        codeEles.forEach((codeEle, key) => {
          addIcon(codeEle)
          const copyBtn = codeEle.querySelector('.copy-btn')
          const handler = () => {
            copyBtn?.classList.add('clicked')

            const timer = setTimeout(() => {
              copyBtn?.classList.remove('clicked')
              clearTimeout(timer)
            }, 1000)
            navigator.clipboard?.writeText(codeEle.innerText ?? '') || copy(codeEle?.innerText ?? '')
          }

          // @ts-expect-error for destroy this listener
          el._destroyCopy[key] = function () {
            return copyBtn?.removeEventListener('click', handler)
          }
          copyBtn?.addEventListener('click', handler)
        })
      }
      // @ts-expect-error for reuse
      el._init()

      /**
       *  @description add copy icon
       */
      function addIcon(codeEle: HTMLElement) {
        const copyBtn = `<div class="copy-btn"><div class="tooltip-copy" data-content-before="${t('chat.copied')}"><img src="${copyBtnIcon}" class="icon-copy" title="${t('chat.copyCode')}"></div></div>`
        codeEle && (codeEle.innerHTML += copyBtn)
      }
    },
    updated(el) {
      el._init?.()
    },
    unmounted(el) {
      Object.keys(el._destroyCopy).forEach(key => el._destroyCopy[key]())
    },
  })
}
