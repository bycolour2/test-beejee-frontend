import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

export const setAuthToken = (accessToken: string | null) => {
  if (accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${accessToken}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
  }
}
