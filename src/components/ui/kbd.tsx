import type React from 'react'
import { cn } from '@/utils/utils'

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'pointer-events-none inline-flex min-h-[18px] min-w-[18px] select-none items-center justify-center rounded-[4px] px-1.5',
        'ring-1 ring-inset ring-neutral-700/80 retina:ring-[0.5px]',
        'bg-gradient-to-br from-neutral-600 via-neutral-700 to-neutral-800',
        'font-sans text-[9px] font-bold tracking-wide text-neutral-200',
        'shadow-[0_1.5px_0_oklch(0.20_0_0),inset_0_1px_0_oklch(100%_0_0/0.2),inset_0_-1px_1px_oklch(0%_0_0/0.4)]',
        '[text-shadow:0_1px_1px_oklch(0%_0_0/0.5)]',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
