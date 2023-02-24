import 'highlight.js/styles/xcode.css'
import 'github-markdown-css/github-markdown.css'
import '@/styles/global.css'

/** Tailwind's Preflight Style Override */
function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

function setupAssets() {
  naiveStyleOverride()
}

export default setupAssets
