import type React from 'react'
import { cn } from '@/utils/utils'

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

/** A single key drawn as a keycap, for the shortcut hints */
export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'pointer-events-none inline-flex h-4 min-w-4 select-none items-center justify-center rounded px-1',
        'bg-current/12 ring-1 ring-inset ring-current/20 retina:ring-[0.5px]',
        'font-sans text-[10px] font-medium leading-none tracking-wide',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
