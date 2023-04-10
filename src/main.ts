import { createApp } from 'vue'
import JsonViewer from 'vue3-json-viewer'
import App from './App.vue'

import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import 'vue3-json-viewer/dist/index.css'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)
  app.use(JsonViewer)

  app.mount('#app')
}

bootstrap()
