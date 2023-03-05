import type { App } from 'vue'
import setCopyDirective from './copy'
import setupHighlightDirective from './highlight'

export function setupDirectives(app: App) {
  setCopyDirective(app)
  setupHighlightDirective(app)
}
