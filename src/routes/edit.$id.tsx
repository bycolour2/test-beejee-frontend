import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useStorage } from '@/hooks/useStorage'

export const Route = createFileRoute('/edit/$id')({
  component: EditTodoPage,
})

const editTodoFormSchema = z.object({
  description: z
    .string()
    .min(2, { message: 'Текст задачи должен содержать минимум 2 символов.' })
    .max(500, {
      message: 'Текст задачи должен содержать не более 500 символов.',
    }),
  completed: z.boolean(),
})

type EditTodoFormValues = z.infer<typeof editTodoFormSchema>

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

  const {
    value: persistedFormValues,
    set,
    remove,
  } = useStorage<Partial<EditTodoFormValues>>('todo-edit-form')

  const form = useForm<EditTodoFormValues>({
    resolver: zodResolver(editTodoFormSchema),
    defaultValues: persistedFormValues,
  })
  const formValues = useWatch({ control: form.control })

  useEffect(() => {
    set(formValues)
  }, [formValues])

  useEffect(() => {
    return () => remove()
  }, [])

  useEffect(() => {
    if (persistedFormValues) {
      form.reset({
        description: persistedFormValues.description,
        completed: persistedFormValues.completed,
      })
    } else if (todo) {
      set(todo)
      form.reset({
        description: todo.description,
        completed: todo.completed,
      })
    }
  }, [todo, form])

  const onSubmit = async (values: EditTodoFormValues) => {
    try {
      await updateTodo(todoId, {
        description: values.description,
        completed: values.completed,
      }).then(() => {
        toast.success('Задача обновлена', { richColors: true })
      })
      navigate({ to: '/' })
    } catch (_err) {
      toast.error('Ошибка при обновлении задачи', { richColors: true })
    }
  }

  return (
    <div className="container mx-auto max-w-md py-6 max-sm:px-4">
      <Card className="border-4">
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
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold max-sm:text-sm">Автор:</p>
                    <p className="text-gray-700 max-sm:text-sm dark:text-gray-300">
                      {todo.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <p className="font-semibold max-sm:text-sm">Email:</p>
                    <p className="text-gray-700 max-sm:text-sm dark:text-gray-300">
                      {todo.email}
                    </p>
                  </div>
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
