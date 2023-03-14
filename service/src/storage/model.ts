import type { ObjectId } from 'mongodb'

enum Status {
  Normal = 0,
  Deleted = 1,
  InversionDeleted = 2,
  ResponseDeleted = 3,
  PreVerify = 4,
}

class UserInfo {
  _id: ObjectId
  name: string
  email: string
  password: string
  status: Status
  createTime: string
  verifyTime?: string
  constructor(email: string, password: string) {
    this.name = email
    this.email = email
    this.password = password
    this.status = Status.PreVerify
    this.createTime = new Date().toLocaleString()
    this.verifyTime = null
  }
}

class UserOauth {
  userId: number
  oauthType: OauthType
  oauthId: string

  constructor(userId: number, oauthType: OauthType, oauthId: string) {
    this.userId = userId
    this.oauthType = oauthType
    this.oauthId = oauthId
  }
}

class ChatRoom {
  _id: ObjectId
  roomId: number
  userId: number
  title: string
  status: Status = Status.Normal
  constructor(userId: number, title: string, roomId: number) {
    this.userId = userId
    this.title = title
    this.roomId = roomId
  }
}

class ChatOptions {
  parentMessageId?: string
  messageId?: string
  constructor(parentMessageId?: string, messageId?: string) {
    this.parentMessageId = parentMessageId
    this.messageId = messageId
  }
}

class ChatInfo {
  _id: ObjectId
  roomId: number
  uuid: number
  dateTime: number
  prompt: string
  response?: string
  status: Status = Status.Normal
  options: ChatOptions
  constructor(roomId: number, uuid: number, prompt: string, options: ChatOptions) {
    this.roomId = roomId
    this.uuid = uuid
    this.prompt = prompt
    this.options = options
    this.dateTime = new Date().getTime()
  }
}

export { UserInfo, UserOauth, ChatRoom, ChatInfo, ChatOptions, Status }
