import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollToBottom: (hasScroll?: boolean) => Promise<void>
  scrollToTop: () => Promise<void>
}

export function useScroll(): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)
  const isScroll = ref<boolean>(false)

  const scrollToBottom = async (hasScroll?: boolean) => {
    if (
      scrollRef.value
      && (scrollRef.value.scrollTop + scrollRef.value.clientHeight
          === scrollRef.value.scrollHeight
        || !!hasScroll)
    )
      isScroll.value = true
    else isScroll.value = false

    await nextTick()
    if (scrollRef.value && isScroll.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const threshold = 100 // 阈值，表示滚动条到底部的距离阈值
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
  }
}
