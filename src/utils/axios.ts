import axios, { AxiosInstance } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/signup'
    }

    return Promise.reject(error)
  }
)
