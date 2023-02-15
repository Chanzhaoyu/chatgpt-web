import { createApp } from 'vue'
import App from './App.vue'
import { setupAssets } from '@/plugins'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import hljs from 'highlight.js'
import "highlight.js/styles/xcode.css"
async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupStore(app)

  await setupRouter(app)

  let regexp = /^(?:\s{4}|\t).+/gm
  app.directive('hljs', {
    mounted: (el: HTMLElement) => {
      if (el.textContent?.indexOf(" = ") != -1 || el.textContent.match(regexp)) {
        hljs.highlightBlock(el)
      }
    }
  })

  app.mount('#app')
}

bootstrap()
