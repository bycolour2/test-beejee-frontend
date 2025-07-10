import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import { Textarea } from './ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateTodo } from '@/hooks/useReduxTodos'

const createTodoFormSchema = z.object({
  author: z
    .string()
    .min(2, { message: 'Имя пользователя должно содержать минимум 2 символа.' })
    .max(50, {
      message: 'Имя пользователя должно содержать не более 50 символов.',
    }),
  email: z.email({ message: 'Введите корректный email.' }),
  description: z
    .string()
    .min(5, { message: 'Текст задачи должен содержать минимум 5 символов.' })
    .max(500, {
      message: 'Текст задачи должен содержать не более 250 символов.',
    }),
})

type CreateTodoFormValues = z.infer<typeof createTodoFormSchema>

export const CreateTodoCard = () => {
  const { createTodo, loading: createLoading, error } = useCreateTodo()

  const form = useForm<CreateTodoFormValues>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: {
      author: '',
      email: '',
      description: '',
    },
  })

  const onSubmit = async (values: CreateTodoFormValues) => {
    try {
      await createTodo(values).then(() => toast('Задача создана'))
      form.reset()
    } catch (submitError) {
      console.error('Ошибка при создании задачи:', submitError)
    }
  }

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle className="text-xl">Создать новую задачу</CardTitle>
        <CardDescription>Заполните форму для создания задачи</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Иванов" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@mail.com"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текст задачи</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание задачи"
                      {...field}
                      required
                      className="max-h-64"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-xs text-red-500">{error}</div>}

            <Button
              type="submit"
              variant="default"
              disabled={createLoading}
              className="w-full"
            >
              {createLoading ? 'Создание...' : 'Создать задачу'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
