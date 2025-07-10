import { Outlet, createRootRoute } from '@tanstack/react-router'

import { useEffect } from 'react'
import type { Theme } from '@/hooks/useTheme'
import { useTheme } from '@/hooks/useTheme'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/sonner'

const theme: Theme = localStorage.getItem('theme') as Theme

export const Route = createRootRoute({
  component: () => {
    const { setTheme } = useTheme()

    useEffect(() => {
      setTheme(theme)
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
