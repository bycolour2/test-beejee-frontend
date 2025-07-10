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

export default function Header() {
  const { isAuthenticated, logout } = useAuth()

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
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="default">Войти</Button>
            </Link>
          )}
        </div>

        <ThemeSwitcher />
      </div>
    </header>
  )
}
