import axios, {type AxiosResponse} from 'axios'
import {useAuthStore} from '@/store'
import {useMessage} from "naive-ui";

const message = useMessage()
const service = axios.create({
	baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
	(config) => {
		const token = useAuthStore().token
		// config.headers.Authorization = 'd5a6eec5-6403-4b27-a2d7-f84cd4728e4f'
		if (token) {
			config.headers.Authorization = `${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error.response)
	},
)

service.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => {
		if (response.status === 200) {

			message.success(response.data.message);
			return response
		} else {
			message.error(response.data.message);
		}

		throw new Error(response.status.toString())
	},
	(error) => {
		return Promise.reject(error)
	},
)

export default service
