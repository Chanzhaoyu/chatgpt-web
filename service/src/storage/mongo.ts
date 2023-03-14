import { MongoClient, ObjectId } from 'mongodb'
import { ChatInfo, ChatRoom, Status, UserInfo } from './model'
import type { ChatOptions } from './model'

const url = process.env.MONGODB_URL
const client = new MongoClient(url)
const chatCol = client.db('chatgpt').collection('chat')
const roomCol = client.db('chatgpt').collection('chat_room')
const userCol = client.db('chatgpt').collection('user')

/**
 * 插入聊天信息
 * @param text 内容 prompt or response
 * @param roomId
 * @param options
 * @returns model
 */
export async function insertChat(uuid: number, text: string, roomId: number, options?: ChatOptions) {
  const chatInfo = new ChatInfo(roomId, uuid, text, options)
  await chatCol.insertOne(chatInfo)
  return chatInfo
}

export async function getChat(roomId: number, uuid: number) {
  return await chatCol.findOne({ roomId, uuid })
}

export async function updateChat(chatId: string, response: string, messageId: string) {
  const query = { _id: new ObjectId(chatId) }
  const update = {
    $set: { 'response': response, 'options.messageId': messageId },
  }
  await chatCol.updateOne(query, update)
}

export async function createChatRoom(userId: ObjectId, title: string, roomId: number) {
  const room = new ChatRoom(userId, title, roomId)
  await roomCol.insertOne(room)
  return room
}
export async function renameChatRoom(userId: ObjectId, title: string, roomId: number) {
  const query = { userId, roomId }
  const update = {
    $set: {
      title,
    },
  }
  const result = await roomCol.updateOne(query, update)
  return result
}

export async function deleteChatRoom(userId: ObjectId, roomId: number) {
  const result = await roomCol.updateOne({ roomId, userId }, { $set: { status: Status.Deleted } })
  await clearChat(roomId)
  return result
}

export async function getChatRooms(userId: ObjectId) {
  const cursor = await roomCol.find({ userId, status: { $ne: Status.Deleted } })
  const rooms = []
  await cursor.forEach(doc => rooms.push(doc))
  return rooms
}

export async function existsChatRoom(userId: ObjectId, roomId: number) {
  const room = await roomCol.findOne({ roomId, userId })
  return !!room
}

export async function getChats(roomId: number, lastTime?: number) {
  if (!lastTime)
    lastTime = new Date().getTime()
  const query = { roomId, dateTime: { $lt: lastTime }, status: { $ne: Status.Deleted } }
  const sort = { dateTime: -1 }
  const limit = 200
  const cursor = await chatCol.find(query).sort(sort).limit(limit)
  const chats = []
  await cursor.forEach(doc => chats.push(doc))
  chats.reverse()
  return chats
}

export async function clearChat(roomId: number) {
  const query = { roomId }
  const update = {
    $set: {
      status: Status.Deleted,
    },
  }
  await chatCol.updateMany(query, update)
}

export async function deleteChat(roomId: number, uuid: number, inversion: boolean) {
  const query = { roomId, uuid }
  let update = {
    $set: {
      status: Status.Deleted,
    },
  }
  const chat = await chatCol.findOne(query)
  if (chat.status === Status.InversionDeleted && !inversion) { /* empty */ }
  else if (chat.status === Status.ResponseDeleted && inversion) { /* empty */ }
  else if (inversion) {
    update = {
      $set: {
        status: Status.InversionDeleted,
      },
    }
  }
  else {
    update = {
      $set: {
        status: Status.ResponseDeleted,
      },
    }
  }
  chatCol.updateOne(query, update)
}

export async function createUser(email: string, password: string) {
  email = email.toLowerCase()
  const userInfo = new UserInfo(email, password)
  if (email === process.env.ROOT_USER)
    userInfo.status = Status.Normal

  await userCol.insertOne(userInfo)
  return userInfo
}

export async function updateUserName(userId: ObjectId, name: string) {
  const result = userCol.updateOne({ _id: userId }, { name: { $set: name } })
  return result
}

export async function getUser(email: string) {
  email = email.toLowerCase()
  return await userCol.findOne({ email })
}

export async function verifyUser(email: string) {
  email = email.toLowerCase()
  return await userCol.updateOne({ email }, { $set: { status: Status.Normal, verifyTime: new Date().toLocaleString() } })
}
