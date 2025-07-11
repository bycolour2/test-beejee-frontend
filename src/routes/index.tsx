import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { Todo } from '@/store/slices/todosSlice'
import { selectQueryParams, setPage } from '@/store/slices/todosSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useTodosList } from '@/hooks/useReduxTodos'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TodoCard } from '@/components/TodoCard'
import { selectIsAdmin } from '@/store/slices/authSlice'
import { TodoSortingControls } from '@/components/TodoSortingControls'
import { Skeleton } from '@/components/ui/skeleton'
import { Paginator } from '@/components/ui/paginator'
import { CreateTodoForm } from '@/components/CreateTodoForm'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const dispatch = useAppDispatch()
  const { page, sort, order } = useAppSelector(selectQueryParams)

  const { todos, totalCount, loading, error, fetchTodos } = useTodosList()

  const isAdmin = useAppSelector(selectIsAdmin)

  useEffect(() => {
    fetchTodos()
  }, [page, sort, order])

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
  }

  const totalPages = totalCount ? Math.ceil(totalCount / 3) : 0

  return (
    <div className="container mx-auto py-6 max-sm:px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border-4">
            <CardHeader>
              <CardTitle className="text-2xl">Список задач</CardTitle>
              <CardDescription>Всего задач: {totalCount || 0}</CardDescription>

              <TodoSortingControls />
            </CardHeader>

            <CardContent className="min-h-[calc(var(--spacing)*56*3+var(--spacing)*4*2)] sm:min-h-[calc(var(--spacing)*44*3+var(--spacing)*4*2)]">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-56 shadow-shadow sm:h-44" />
                  <Skeleton className="h-56 shadow-shadow sm:h-44" />
                  <Skeleton className="h-56 shadow-shadow sm:h-44" />
                </div>
              ) : error ? (
                <div className="py-10 text-center text-red-500">
                  Ошибка при загрузке задач
                </div>
              ) : todos.length === 0 ? (
                <div className="py-10 text-center">Задачи не найдены</div>
              ) : (
                <div className="space-y-4">
                  {todos.map((todo: Todo) => (
                    <TodoCard key={todo.id} todo={todo} isAdmin={isAdmin} />
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter>
              {totalPages > 1 && (
                <Paginator
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="max-md:order-first">
          <CreateTodoForm />
        </div>
      </div>
    </div>
  )
}
