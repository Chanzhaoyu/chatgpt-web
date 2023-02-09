import 'virtual:svg-icons-register'
import './styles/css/tailwind.css'
import './styles/less/global.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

function injectMeta() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

function bootstrap() {
  const app = createApp(App)
  injectMeta()
  app.use(createPinia())
  app.mount('#app')
}

bootstrap()
