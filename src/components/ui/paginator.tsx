import { useMemo } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination'
import type { FC } from 'react'

type PaginatorProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void

  siblingCount?: number

  showEllipsis?: boolean
  showPreviousLabel?: boolean
  showNextLabel?: boolean
}

export const Paginator: FC<PaginatorProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  showEllipsis = true,
  showNextLabel = false,
  showPreviousLabel = false,
}) => {
  const visiblePages = useMemo(() => {
    if (totalPages <= 2 * siblingCount + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const rangeWithDots: Array<number | string> = []

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 2 * siblingCount + 2
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)

      rangeWithDots.push(...leftRange)

      if (showEllipsis) {
        rangeWithDots.push('...')
      }

      rangeWithDots.push(lastPageIndex)

      return rangeWithDots
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 2 * siblingCount + 2
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      )

      rangeWithDots.push(firstPageIndex)

      if (showEllipsis) {
        rangeWithDots.push('...')
      }

      rangeWithDots.push(...rightRange)

      return rangeWithDots
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      rangeWithDots.push(firstPageIndex)

      if (showEllipsis && leftSiblingIndex > 2) {
        rangeWithDots.push('...')
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        rangeWithDots.push(i)
      }

      if (showEllipsis && rightSiblingIndex < totalPages - 1) {
        rangeWithDots.push('...')
      }

      rangeWithDots.push(lastPageIndex)

      return rangeWithDots
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [currentPage, totalPages, siblingCount, showEllipsis])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(currentPage - 1)
            }}
            showLabel={showPreviousLabel}
            disabled={isFirstPage}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page as number)
                }}
                isActive={currentPage === page}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(currentPage + 1)
            }}
            showLabel={showNextLabel}
            disabled={isLastPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
