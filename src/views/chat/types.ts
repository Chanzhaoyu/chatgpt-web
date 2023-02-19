export interface Chat {
  dateTime: string
  text: string
  inversion?: boolean
  error?: boolean
}

export interface History {
  title: string
  isEdit: boolean
  uuid: number
}

export interface ChatState {
  active: number | null
  history: History[]
  chat: { uuid: number; data: Chat[] }[]
}
