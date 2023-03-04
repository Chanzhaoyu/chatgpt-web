import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import { setupI18n } from './locales'
import { setupAssets } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupDoreamon } from './doreamon'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupStore(app)

  setupDirectives(app)

  setupI18n(app)

  await setupRouter(app)

  await setupDoreamon(app)

  app.mount('#app')
}

bootstrap()

