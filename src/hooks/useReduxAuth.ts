import { useCallback } from 'react'
import type { LoginRequest } from '@/api/authApi'
import {
  clearError,
  loginThunk,
  logoutThunk,
  selectError,
  selectIsAdmin,
  selectIsAuthenticated,
  selectLoading,
} from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isAdmin = useAppSelector(selectIsAdmin)
  const loading = useAppSelector(selectLoading)
  const error = useAppSelector(selectError)

  const login = useCallback(
    (credentials: LoginRequest) => {
      return dispatch(loginThunk(credentials)).unwrap()
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    return dispatch(logoutThunk()).unwrap()
  }, [dispatch])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    logout,
    resetError,
  }
}
