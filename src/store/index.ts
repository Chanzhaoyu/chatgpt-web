import type { App } from 'vue'
import { store } from './helper'

export function setupStore(app: App) {
  app.use(store)
}

export * from './modules'
