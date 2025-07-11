import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useReduxAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { loginErrorText } from '@/store/slices/authSlice'

const loginFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Имя пользователя должно содержать минимум 2 символа.',
  }),
  password: z.string().min(2, {
    message: 'Пароль должен содержать минимум 2 символа.',
  }),
})

type LoginFormSchema = z.infer<typeof loginFormSchema>

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { isAuthenticated, error, login, me, resetError } = useAuth()

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormSchema) => {
    resetError()
    return login(values).then(me)
  }

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="container mx-auto flex justify-center py-10 max-sm:px-4">
      <Card className="w-full max-w-md border-4">
        <CardHeader>
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
          <CardDescription>
            Войдите как администратор для редактирования задач
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input placeholder="Имя пользователя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Ваш пароль"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error ? (
                <div className="text-sm text-red-500">
                  {loginErrorText[error]}
                </div>
              ) : (
                <div className="h-5" />
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-center text-sm text-balance">
            Для входа используйте: логин <strong>admin</strong>, пароль{' '}
            <strong>123</strong>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
