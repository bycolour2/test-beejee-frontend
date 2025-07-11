import { Outlet, createRootRoute } from '@tanstack/react-router'

import { useEffect } from 'react'
import type { Theme } from '@/hooks/useTheme'
import { useTheme } from '@/hooks/useTheme'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { meThunk, selectIsAuthenticated } from '@/store/slices/authSlice'

const theme: Theme = localStorage.getItem('theme') as Theme

export const Route = createRootRoute({
  component: () => {
    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const { setTheme } = useTheme()

    useEffect(() => {
      setTheme(theme)

      if (isAuthenticated) {
        dispatch(meThunk())
      }
    }, [])

    return (
      <div className="flex h-screen flex-col font-montserrat">
        <Header />

        <div className="flex-1">
          <Outlet />
        </div>

        <Toaster />
      </div>
    )
  },
})
