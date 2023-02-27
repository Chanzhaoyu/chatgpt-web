import type { App } from 'vue'
import setupHighlightDirective from './highlight'

export function setupDirectives(app: App) {
  setupHighlightDirective(app)
}
