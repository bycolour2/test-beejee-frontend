import { axiosInstance } from './common'
import type { Todo } from '@/store/slices/todosSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type SortValues = 'author' | 'email' | 'completed' | undefined
export type OrderValues = 'asc' | 'desc'

export type TodosQueryParams = {
  page?: number
  pageSize?: number
  sort?: SortValues
  order?: OrderValues
}

export type PaginatedResponse<T> = {
  data: T
  page: number
  pageSize: number
  count: number
}

export type TodosResponse = PaginatedResponse<Array<Todo>>

export type CreateTodoDto = {
  author: string
  email: string
  description: string
}

export type UpdateTodoDto = {
  description?: string
  completed?: boolean
}

export const fetchTodos = async (
  params: TodosQueryParams,
): Promise<TodosResponse> => {
  const { page = 1, pageSize = 3, sort, order } = params

  const queryParams = new URLSearchParams()
  if (page) queryParams.append('page', page.toString())
  if (pageSize) queryParams.append('pageSize', pageSize.toString())
  if (sort) queryParams.append('sort', sort)
  if (order) queryParams.append('order', order)

  const response = await axiosInstance.get<TodosResponse>(
    `${API_BASE_URL}/todos?${queryParams.toString()}`,
  )

  return {
    data: response.data.data,
    page: response.data.page,
    pageSize: response.data.pageSize,
    count: response.data.count,
  }
}

export const fetchTodoById = async (id: number): Promise<Todo> => {
  const response = await axiosInstance.get<Todo>(`${API_BASE_URL}/todos/${id}`)

  return response.data
}

export const createTodo = async (todoData: CreateTodoDto): Promise<Todo> => {
  const response = await axiosInstance.post<Todo>(
    `${API_BASE_URL}/todos`,
    todoData,
  )

  return response.data
}

export const updateTodo = async (
  id: number,
  todoData: UpdateTodoDto,
): Promise<Todo> => {
  const response = await axiosInstance.patch<Todo>(
    `${API_BASE_URL}/todos/${id}`,
    todoData,
  )

  return response.data
}
