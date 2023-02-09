import 'virtual:svg-icons-register'
import './styles/tailwind.css'
import './styles/global.css'

import { createApp } from 'vue'
import App from './App.vue'

function injectMeta() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

function bootstrap() {
  const app = createApp(App)
  injectMeta()
  app.mount('#app')
}

bootstrap()
