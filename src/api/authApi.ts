import { axiosInstance } from './common'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  accessToken: string
}

export type ErrorResponse = {
  message: string
}

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    `${API_BASE_URL}/auth/login`,
    credentials,
  )
  return response.data
}

export const logout = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.get<{ message: string }>(
    `${API_BASE_URL}/auth/logout`,
  )
  return response.data
}
