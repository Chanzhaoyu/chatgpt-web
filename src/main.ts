import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'

/** Tailwind's Preflight Style Override */
function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

/** Setup */
function bootstrap() {
  const app = createApp(App)
  naiveStyleOverride()
  app.mount('#app')
}

bootstrap()
