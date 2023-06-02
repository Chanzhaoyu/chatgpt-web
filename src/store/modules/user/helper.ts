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
      avatar: 'https://objectstorage.ap-seoul-1.oraclecloud.com/n/cnmdbvtb8tow/b/bucket-20230304-2230/o/dongjianggangdongjianggang.jpg',
      name: '俊爷的chatgpt',
      description: 'Star on <a href="https://github.com/rimutuyuan0901/chatgpt-web" class="text-blue-500" target="_blank" >GitHub</a>',
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
