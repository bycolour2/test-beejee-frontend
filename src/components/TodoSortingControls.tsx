import type { FC } from 'react'
import type { OrderValues, SortValues } from '@/api/todosApi'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectQueryParams, setOrder, setSort } from '@/store/slices/todosSlice'

export const TodoSortingControls: FC = () => {
  const dispatch = useAppDispatch()
  const { sort: sortValue } = useAppSelector(selectQueryParams)

  const handleSortChange = (value: string) => {
    if (value === 'unsorted') {
      dispatch(setSort(undefined))
    } else {
      dispatch(setSort(value as SortValues))
    }
  }

  const handleOrderChange = (value: string) => {
    dispatch(setOrder(value as OrderValues))
  }

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Label htmlFor="sort-select">Сортировать по</Label>
        <Select onValueChange={handleSortChange} defaultValue="">
          <SelectTrigger id="sort-select">
            <SelectValue placeholder="Без сортировки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unsorted">Без сортировки</SelectItem>
            <SelectItem value="author">По пользователю</SelectItem>
            <SelectItem value="email">По email</SelectItem>
            <SelectItem value="completed">По статусу</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="order-select">Порядок</Label>
        <Select
          onValueChange={handleOrderChange}
          defaultValue="asc"
          disabled={sortValue === undefined}
        >
          <SelectTrigger id="order-select">
            <SelectValue placeholder="Порядок" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">По возрастанию</SelectItem>
            <SelectItem value="desc">По убыванию</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
