import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import { setupAssets } from '@/plugins'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupStore(app)

  setupDirectives(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
