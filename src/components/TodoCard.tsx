import { Link } from '@tanstack/react-router'
import { CheckCircle, Pencil, XCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import type { Todo } from '@/store/slices/todosSlice'

interface TodoCardProps {
  todo: Todo
  isAdmin: boolean
}

export function TodoCard({ todo, isAdmin }: TodoCardProps) {
  return (
    <Card className="h-56 gap-2 py-4 sm:h-44">
      <CardContent className="h-full flex-1">
        <div className="flex h-full flex-1 gap-3">
          <div className="flex w-full min-w-0 flex-1 flex-col justify-between gap-3">
            <div className="w-full flex-1 shrink overflow-y-auto border-b-2 pr-3 pb-2 break-all">
              <p className="font-medium break-words whitespace-pre-line text-foreground">
                {todo.description}
              </p>
            </div>

            <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-300">
                  {todo.author}
                </p>
                <a
                  className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                  href={`mailto:${todo.email}`}
                  target="_blank"
                >
                  {todo.email}
                </a>
              </div>

              <div className="flex flex-col gap-1 sm:items-end">
                {todo.completed ? (
                  <Badge
                    variant="neutral"
                    className="flex items-center gap-1 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className="h-4 w-4" /> Выполнено
                  </Badge>
                ) : (
                  <Badge
                    variant="neutral"
                    className="flex items-center gap-1 text-foreground"
                  >
                    <XCircle className="h-4 w-4" /> Не выполнено
                  </Badge>
                )}

                {todo.updatedByAdmin && (
                  <p className="text-xs text-gray-500">
                    Обновлено администратором
                  </p>
                )}
              </div>
            </div>
          </div>

          {isAdmin && (
            <Button size="icon" className="h-full shrink-0" asChild>
              <Link to="/edit/$id" params={{ id: todo.id.toString() }}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
