import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'
import ThemeSwitcher from './ThemeSwitcher'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useAuth } from '@/hooks/useReduxAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleTheme, currentTheme } = useTheme()

  const handleThemeToggleClick = toggleTheme

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-primary text-primary-foreground flex items-center justify-between border-b-4 px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="hover:text-primary-foreground/80 text-xl font-bold"
        >
          Задачник
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="noShadow" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      {user ? user.username.charAt(0).toUpperCase() : 'Unk'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleThemeToggleClick}>
                  <svg
                    className="hidden dark:block"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"></path>
                    <path d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"></path>
                  </svg>
                  <svg
                    className="dark:hidden"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="fill-foreground"
                      d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z"
                    ></path>
                    <path
                      className="fill-foreground"
                      d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"
                    ></path>
                  </svg>
                  <span>
                    {currentTheme === 'light' ? 'Светлая' : 'Тёмная'} тема
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="default">Войти</Button>
            </Link>
          )}
        </div>

        {!isAuthenticated ? <ThemeSwitcher /> : null}
      </div>
    </header>
  )
}
