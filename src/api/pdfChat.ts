import { get, post } from '@/utils/request'
import type { Message } from '@/api/typing'

export interface PdfChat {
  messages: Message[]
  pdfChatId: string
  pdfId: string

}

export function getPdfChatList(pdfId: string) {
  return get<PdfChat[]>({
    url: `/pdf-chat/list?pdfId=${pdfId}`,
  })
}

export function createPdfChat(pdfId: string) {
  return post<string>({
    url: `/pdf-chat/add?pdfId=${pdfId}`,
  })
}
