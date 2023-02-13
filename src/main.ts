import './styles/global.css'

import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'

/** Tailwind's Preflight Style Override */
function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

/** Setup */
async function bootstrap() {
  const app = createApp(App)
  naiveStyleOverride()
  await setupRouter(app)
  app.mount('#app')
}

bootstrap()
