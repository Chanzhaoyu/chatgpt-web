import axios from 'axios'

const BASE_URL = import.meta.env.VITE_GLOB_API_URL

async function fetchChatAPI(message: string) {
  if (!message || message.trim() === '')
    return

  try {
    const { status, data } = await axios.post(`${BASE_URL}/chat`, { message })

    if (status === 200) {
      if (data.text)
        return Promise.resolve(data)

      if (data.statusText)
        return Promise.reject(new Error(data.statusText))
    }

    return Promise.reject(new Error('Request failed'))
  }
  catch (error) {
    return Promise.reject(error)
  }
}

async function clearChatContext() {
  try {
    const { status, data } = await axios.post(`${BASE_URL}/clear`)

    if (status === 200)
      return Promise.resolve(data)

    return Promise.reject(new Error('Request failed'))
  }
  catch (error) {
    return Promise.reject(error)
  }
}

export { fetchChatAPI, clearChatContext }
