import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  CreateTodoDto,
  OrderValues,
  SortValues,
  UpdateTodoDto,
} from '@/api/todosApi'
import {
  updateTodo as apiUpdateTodo,
  createTodo,
  fetchTodoById,
  fetchTodos,
} from '@/api/todosApi'

export const fetchTodosThunk = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { todos: TodosState }
      return await fetchTodos({
        page: state.todos.queryParams.page,
        pageSize: state.todos.queryParams.pageSize,
        sort: state.todos.queryParams.sort,
        order: state.todos.queryParams.order,
      })
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при загрузке задач',
      )
    }
  },
)

export const fetchTodoByIdThunk = createAsyncThunk(
  'todos/fetchTodoById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await fetchTodoById(id)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при загрузке задачи',
      )
    }
  },
)

export const createTodoThunk = createAsyncThunk(
  'todos/createTodo',
  async (todoData: CreateTodoDto, { rejectWithValue, dispatch }) => {
    try {
      const newTodo = await createTodo(todoData)
      await dispatch(fetchTodosThunk())
      return newTodo
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при создании задачи',
      )
    }
  },
)

export const updateTodoThunk = createAsyncThunk(
  'todos/updateTodo',
  async (
    { id, data }: { id: number; data: UpdateTodoDto },
    { rejectWithValue },
  ) => {
    try {
      return await apiUpdateTodo(id, data)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при обновлении задачи',
      )
    }
  },
)

export type Todo = {
  id: number
  description: string
  author: string
  email: string
  completed: boolean
  updatedByAdmin: boolean
}

export type TodosState = {
  todos: Array<Todo>
  totalCount: number
  loading: boolean
  error: string | null
  currentTodo: Todo | null
  queryParams: {
    page: number
    pageSize: number
    sort: SortValues
    order: OrderValues
  }
}

const initialState: TodosState = {
  todos: [],
  totalCount: 0,
  loading: false,
  error: null,
  currentTodo: null,
  queryParams: {
    page: 1,
    pageSize: 3,
    sort: undefined,
    order: 'asc',
  },
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.queryParams.page = action.payload
    },
    setSort: (state, action: PayloadAction<SortValues>) => {
      state.queryParams.sort = action.payload
    },
    setOrder: (state, action: PayloadAction<OrderValues>) => {
      state.queryParams.order = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodosThunk.fulfilled, (state, action) => {
        state.loading = false
        state.todos = action.payload.data
        state.totalCount = action.payload.count
      })
      .addCase(fetchTodosThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Ошибка при загрузке задач'
      })

    builder
      .addCase(fetchTodoByIdThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodoByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.currentTodo = action.payload
      })
      .addCase(fetchTodoByIdThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Ошибка при загрузке задачи'
      })

    builder
      .addCase(createTodoThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTodoThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createTodoThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Ошибка при создании задачи'
      })

    builder
      .addCase(updateTodoThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTodoThunk.fulfilled, (state, action) => {
        state.loading = false
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id,
        )
        if (index !== -1) {
          state.todos[index] = action.payload
        }
        if (state.currentTodo && state.currentTodo.id === action.payload.id) {
          state.currentTodo = action.payload
        }
      })
      .addCase(updateTodoThunk.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) || 'Ошибка при обновлении задачи'
      })
  },
  selectors: {
    selectTodoState: (state) => state,
    selectCurrentTodo: (state) => state.currentTodo,
    selectTodos: (state) => state.todos,
    selectQueryParams: (state) => state.queryParams,
  },
})

export const { clearError, setPage, setSort, setOrder } = todosSlice.actions
export const {
  selectTodoState,
  selectCurrentTodo,
  selectTodos,
  selectQueryParams,
} = todosSlice.selectors

export default todosSlice.reducer
