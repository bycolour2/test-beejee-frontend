import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li data-slot="pagination-item" className={cn('', className)} {...props} />
  )
}

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: React.ComponentProps<'a'> & {
  isActive?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
}) {
  return (
    <a
      data-slot="pagination-link"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: 'noShadow',
          size,
        }),
        className,
        isActive && 'bg-black text-white',
      )}
      {...props}
    />
  )
}

type PaginationSwitchProps = React.ComponentProps<typeof PaginationLink> & {
  showLabel?: boolean
  disabled?: boolean
}

function PaginationPrevious({
  className,
  showLabel = true,
  disabled = false,
  ...props
}: PaginationSwitchProps) {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      aria-label="Go to previous page"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      size={!showLabel ? 'icon' : 'default'}
      className={cn(
        'gap-1',
        showLabel && 'pl-2.5',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      <ChevronLeft className="size-4" />
      {showLabel && <span>Previous</span>}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  showLabel = true,
  disabled = false,
  ...props
}: PaginationSwitchProps) {
  return (
    <PaginationLink
      data-slot="pagination-next"
      aria-label="Go to next page"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      size={!showLabel ? 'icon' : 'default'}
      className={cn(
        'gap-1',
        showLabel && 'pr-2.5',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      {showLabel && <span>Next</span>}
      <ChevronRight className="size-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
