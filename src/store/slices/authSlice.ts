import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import type { LoginRequest } from '@/api/authApi'
import type { ReactNode } from 'react'
import { login as apiLogin, logout as apiLogout, me as apiMe } from '@/api/authApi'
import { setAuthToken } from '@/api/common'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 401)
          return rejectWithValue('Unauthorized')
        if (error.status && error.status > 500)
          return rejectWithValue('Server error')
      }
      return rejectWithValue("Unknown")
    }
  },
)

export const meThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMe()
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 401)
          return rejectWithValue('Unauthorized')
        if (error.status && error.status > 500)
          return rejectWithValue('Server error')
      }
      return rejectWithValue("Unknown")
    }
  },
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout()
      return { success: true }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 401)
          return rejectWithValue('Unauthorized')
        if (error.status && error.status > 500)
          return rejectWithValue('Server error')
      }
      return rejectWithValue("Unknown")
    }
  },
)

export type LoginError = 'Unauthorized' | 'Server error' | "Unknown"
export const loginErrorText: { [Key in LoginError]: ReactNode } = {
  Unauthorized: 'Неправильное имя пользователя или пароль',
  'Server error': 'Ошибка сервера',
  Unknown: 'Неизвестная ошибка',
}

export type User = {
  id: number
  username: string
}

export type AuthState = {
  isAuthenticated: boolean
  isAdmin: boolean
  accessToken: string | null
  user: User | null
  loading: boolean
  error: LoginError | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  accessToken: null,
  user: null,
  loading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = true
      state.isAuthenticated = false
      state.isAdmin = false
      state.accessToken = null
      state.user = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.isAdmin = true
        state.accessToken = action.payload.accessToken
        state.error = null
        setAuthToken(action.payload.accessToken)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as LoginError
      })

      .addCase(meThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(meThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as LoginError
      })

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true
        state.isAuthenticated = false
        state.isAdmin = false
        state.accessToken = null
        state.user = null
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false
        setAuthToken(null)
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false
        setAuthToken(null)
      })
  },
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAdmin: (state) => state.isAdmin,
    selectError: (state) => state.error,
    selectLoading: (state) => state.loading,
    selectUser: (state) => state.user,
  },
})

export const { logout, clearError } = authSlice.actions
export const {
  selectIsAuthenticated,
  selectIsAdmin,
  selectError,
  selectLoading,
  selectUser
} = authSlice.selectors

export default authSlice.reducer
