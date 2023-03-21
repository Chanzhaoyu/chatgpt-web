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
			scrollRef.value &&
			(scrollRef.value.scrollTop + scrollRef.value.clientHeight ===
				scrollRef.value.scrollHeight ||
				!!hasScroll)
		)
			isScroll.value = true;
		else isScroll.value = false;

		await nextTick();
		if (scrollRef.value && isScroll.value)
			scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
  }
}
