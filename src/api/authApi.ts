import { axiosInstance } from './common'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  accessToken: string
}

export type MeResponse = {
  id: number
  username: string
}

export type LogoutResponse = {
  message: string
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

export const me = async (): Promise<MeResponse> => {
  const response = await axiosInstance.get<MeResponse>(
    `${API_BASE_URL}/auth/me`,
  )
  return response.data
}

export const logout = async (): Promise<LogoutResponse> => {
  const response = await axiosInstance.get<LogoutResponse>(
    `${API_BASE_URL}/auth/logout`,
  )
  return response.data
}
