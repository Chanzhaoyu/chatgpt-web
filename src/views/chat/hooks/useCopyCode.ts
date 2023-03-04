import { onMounted, onUpdated } from 'vue'

export function useCopyCode() {
  function copyCodeBlock() {
    const codeBlockWrapper = document.querySelectorAll('.code-block-wrapper')
    codeBlockWrapper.forEach((wrapper) => {
      const copyBtn = wrapper.querySelector('.code-block-header__copy')
      const codeBlock = wrapper.querySelector('.code-block-body')
      if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(codeBlock.textContent ?? '')
        })
      }
    })
  }

  onMounted(() => copyCodeBlock())

  onUpdated(() => copyCodeBlock())
}
