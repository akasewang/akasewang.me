import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createElement,
  type ElementType,
  forwardRef,
} from 'react'

import { cn } from '@/utils/utils'

function styled<T extends ElementType>(Tag: T, base: string, name: string) {
  type Props = ComponentPropsWithoutRef<T> & { className?: string }
  type Ref = ComponentRef<T>
  const Comp = forwardRef<Ref, Props>(({ className, ...props }, ref) =>
    createElement(Tag, { ...props, ref, className: cn(base, className) }),
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
      'relative my-6 w-full overflow-x-auto rounded-xl border border-border/60 bg-code-block not-prose',
      '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
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

const TableHeader = styled(
  'thead',
  'border-b border-border/50 bg-[color-mix(in_oklab,var(--code-tab)_50%,var(--code-block))] [&_tr]:border-0',
  'TableHeader',
)
const TableBody = styled(
  'tbody',
  '[&_tr]:transition-colors [&_tr]:duration-200 supports-hover:[&_tr:hover]:bg-[color-mix(in_oklab,var(--muted)_20%,var(--code-block))] [&_tr:last-child]:border-0',
  'TableBody',
)
const TableRow = styled('tr', 'border-b border-border/30', 'TableRow')
const TableHead = styled(
  'th',
  'whitespace-nowrap px-4 py-2.5 text-left align-middle font-mono text-[10px] font-medium lowercase tracking-widest text-muted-foreground [&:has([role=checkbox])]:pr-0',
  'TableHead',
)
const TableCell = styled(
  'td',
  'px-4 py-2.5 align-middle text-xs leading-relaxed text-foreground [&:has([role=checkbox])]:pr-0',
  'TableCell',
)

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
