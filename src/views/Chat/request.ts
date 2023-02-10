import axios from 'axios'

async function fetchChatAPI(message: string) {
  const url = `${import.meta.env.VITE_GLOB_API_URL}/chat`

  if (!message || message.trim() === '')
    return

  try {
    const { status, data } = await axios.post(url, { message })

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

export { fetchChatAPI }
