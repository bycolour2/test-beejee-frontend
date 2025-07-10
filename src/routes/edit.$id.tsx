import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { UpdateTodoDto } from '@/api/todosApi'
import { useAppSelector } from '@/store/hooks'
import { useTodoDetails, useUpdateTodo } from '@/hooks/useReduxTodos'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { selectIsAdmin, selectIsAuthenticated } from '@/store/slices/authSlice'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/edit/$id')({
  component: EditTodoPage,
})

interface EditTodoFormData extends UpdateTodoDto {
  description: string
  completed: boolean
}

function EditTodoPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const todoId = parseInt(id, 10)

  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isAdmin = useAppSelector(selectIsAdmin)

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isAdmin, navigate])

  const { todo, loading, error, fetchTodoById } = useTodoDetails()

  const { updateTodo, loading: updateLoading } = useUpdateTodo()

  useEffect(() => {
    if (todoId) {
      fetchTodoById(todoId)
    }
  }, [todoId, fetchTodoById])

  const form = useForm<EditTodoFormData>({
    defaultValues: {
      description: '',
      completed: false,
    },
  })

  useEffect(() => {
    if (todo) {
      form.reset({
        description: todo.description,
        completed: todo.completed,
      })
    }
  }, [todo, form])

  const onSubmit = async (values: EditTodoFormData) => {
    try {
      await updateTodo(todoId, {
        description: values.description,
        completed: values.completed,
      })
      navigate({ to: '/' })
    } catch (submitError) {
      console.error('Ошибка при обновлении задачи:', submitError)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-6">
      <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="text-2xl">
            Редактирование задачи #{todoId}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Загрузка...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">
              Ошибка при загрузке задачи
            </div>
          ) : todo ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <div className="mb-4 flex items-center gap-1">
                  <p className="text-sm font-semibold">Автор:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {todo.author}
                  </p>
                </div>

                <div className="mb-4 flex items-center gap-1">
                  <p className="text-sm font-semibold">Email:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {todo.email}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Текст задачи</FormLabel>
                      <FormControl>
                        <Textarea {...field} required className="max-h-80" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Задача выполнена</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="neutral"
                    className="flex-1"
                    onClick={() => navigate({ to: '/' })}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1"
                  >
                    {updateLoading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="py-10 text-center">Задача не найдена</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
