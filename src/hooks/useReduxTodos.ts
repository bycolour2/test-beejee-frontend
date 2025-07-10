import { useCallback } from 'react'
import type { CreateTodoDto, UpdateTodoDto } from '@/api/todosApi'
import {
  clearError,
  createTodoThunk,
  fetchTodoByIdThunk,
  fetchTodosThunk,
  selectTodoState,
  updateTodoThunk,
} from '@/store/slices/todosSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export const useTodosList = () => {
  const dispatch = useAppDispatch()
  const { todos, totalCount, loading, error } = useAppSelector(selectTodoState)

  const fetchTodos = useCallback(() => {
    return dispatch(fetchTodosThunk()).unwrap()
  }, [dispatch])

  return {
    todos,
    totalCount,
    loading,
    error,
    fetchTodos,
  }
}

export const useTodoDetails = () => {
  const dispatch = useAppDispatch()
  const { currentTodo, loading, error } = useAppSelector(selectTodoState)

  const fetchTodoById = useCallback(
    (todoId: number) => {
      return dispatch(fetchTodoByIdThunk(todoId)).unwrap()
    },
    [dispatch],
  )

  return {
    todo: currentTodo,
    loading,
    error,
    fetchTodoById,
  }
}

export const useCreateTodo = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(selectTodoState)

  const createTodo = useCallback(
    (todoData: CreateTodoDto) => {
      return dispatch(createTodoThunk(todoData)).unwrap()
    },
    [dispatch],
  )

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    createTodo,
    loading,
    error,
    resetError,
  }
}

export const useUpdateTodo = () => {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(selectTodoState)

  const updateTodo = useCallback(
    (id: number, data: UpdateTodoDto) => {
      return dispatch(updateTodoThunk({ id, data })).unwrap()
    },
    [dispatch],
  )

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    updateTodo,
    loading,
    error,
    resetError,
  }
}
