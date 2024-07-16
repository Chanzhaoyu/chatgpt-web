export enum Role {
  Assistant = 'assistant',
  System = 'system',
  User = 'user',
}

export interface Message {
  content: string
  role: Role
}

export interface Chat {
  text: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}
