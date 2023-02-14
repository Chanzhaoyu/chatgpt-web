import { deCrypto, enCrypto } from '../crypto'

interface StorageData<T = any> {
  value: T
  expire: number | null
}

function createLocalStorage() {
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 // 7 days

  function set<T = any>(key: string, value: T, expire: number | null = DEFAULT_CACHE_TIME) {
    const storageData: StorageData<T> = {
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    }
    const json = enCrypto(storageData)
    window.localStorage.setItem(key, json)
  }

  function get(key: string) {
    const json = window.localStorage.getItem(key)
    if (json) {
      let storageData: StorageData | null = null

      try {
        storageData = deCrypto(json)
      }
      catch {
        // Prevent failure
      }

      if (storageData) {
        const { value, expire } = storageData
        if (expire === null || expire >= Date.now())
          return value
      }

      remove(key)
      return null
    }
  }

  function remove(key: string) {
    window.localStorage.removeItem(key)
  }

  function clear() {
    window.localStorage.clear()
  }

  return {
    set,
    get,
    remove,
    clear,
  }
}

export const ls = createLocalStorage()
