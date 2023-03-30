import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar: string
  name: string
  description: string
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      avatar: 'https://i.gsxcdn.com/1984397634_0gl847mi.png',
      name: 'Ren',
      description: '<a href="https://i.gsxcdn.com/1984574315_s2sma5d2.jpg" class="text-yellow-600" target="_blank" >请作者喝咖啡~</a>'
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
