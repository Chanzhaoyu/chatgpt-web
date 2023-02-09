import axios from 'axios'

async function fetchChatAPI(message: string) {
  if (!message || message.trim() === '')
    return Promise.reject(new Error('Message is empty'))

  try {
    const { status, data } = await axios.post(
      'http://192.168.110.170:3002/chat',
      { message },
    )

    if (status === 200) {
      if (data.text)
        return Promise.resolve(data)
      else if (data.statusText)
        return Promise.reject(new Error(data.statusText))
    }

    return Promise.reject(new Error('Request failed'))
  }
  catch (error) {
    return Promise.reject(error)
  }
}

export { fetchChatAPI }
