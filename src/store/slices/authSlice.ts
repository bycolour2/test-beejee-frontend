import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoginRequest } from '@/api/authApi'
import { login as apiLogin, logout as apiLogout } from '@/api/authApi'
import { setAuthToken } from '@/api/common'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials)
      return response
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue(error.message || 'Ошибка при входе в систему')
    }
  },
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout()
      return { success: true }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue(error.message || 'Ошибка при выходе из системы')
    }
  },
)

export type AuthState = {
  isAuthenticated: boolean
  isAdmin: boolean
  accessToken: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  accessToken: null,
  loading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
        state.error = (action.payload as string) || 'Ошибка при входе в систему'
      })

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.isAdmin = false
        state.accessToken = null
        setAuthToken(null)
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || 'Ошибка при выходе из системы'
      })
  },
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAdmin: (state) => state.isAdmin,
    selectError: (state) => state.error,
    selectLoading: (state) => state.loading,
  },
})

export const { clearError } = authSlice.actions
export const {
  selectIsAuthenticated,
  selectIsAdmin,
  selectError,
  selectLoading,
} = authSlice.selectors

export default authSlice.reducer
