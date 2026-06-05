import { forwardRef, type ComponentProps } from 'react'

import { cn } from '@/utils/utils'

/**
 * Creates a styled, ref-forwarding wrapper around a native HTML element.
 * Reduces the repeated forwardRef + className merge boilerplate to a single call.
 */
function styled<T extends keyof HTMLElementTagNameMap>(Tag: T, base: string, name: string) {
  const Comp = forwardRef<HTMLElementTagNameMap[T], ComponentProps<T>>(
    ({ className, ...props }, ref) => (
      /** @ts-expect-error — polymorphic ref/props are structurally sound but hard to narrow */
      <Tag ref={ref} className={cn(base, className)} {...props} />
    ),
  )
  Comp.displayName = name
  return Comp
}

const Table = forwardRef<
  HTMLTableElement,
  ComponentProps<'table'> & { containerClassName?: string }
>(({ className, containerClassName, ...props }, ref) => (
  <div
    className={cn(
      'relative my-6 w-full overflow-x-auto rounded-xl bg-code-block py-1 not-prose',
      '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5',
      containerClassName,
    )}
  >
    <table
      ref={ref}
      className={cn('w-full caption-bottom border-collapse text-xs', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = styled('thead', 'border-b border-border [&_tr]:border-0', 'TableHeader')
const TableBody = styled('tbody', '[&_tr:last-child]:border-0', 'TableBody')
const TableFooter = styled(
  'tfoot',
  'border-t border-border font-medium [&>tr]:last:border-b-0',
  'TableFooter',
)
const TableRow = styled('tr', 'border-0', 'TableRow')
const TableHead = styled(
  'th',
  'px-4 py-2 text-left align-middle text-xs font-medium tracking-wide text-muted-foreground [&:has([role=checkbox])]:pr-0',
  'TableHead',
)
const TableCell = styled(
  'td',
  'px-4 py-2 align-middle text-xs leading-relaxed text-foreground [&:has([role=checkbox])]:pr-0',
  'TableCell',
)
const TableCaption = styled(
  'caption',
  'px-4 py-2 text-[11px] text-muted-foreground',
  'TableCaption',
)

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
