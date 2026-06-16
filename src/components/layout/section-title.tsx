import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

interface SectionTitleProps {
  children: ReactNode
  className?: string
  element?: 'h1' | 'h2' | 'h3'
}

export function SectionTitle({ children, className, element: Tag = 'h2' }: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        'text-balance font-serif text-xl font-medium italic leading-snug text-primary',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
