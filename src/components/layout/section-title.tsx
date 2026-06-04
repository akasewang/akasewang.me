import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

/** Props for {@link SectionTitle}. */
interface SectionTitleProps {
  children: ReactNode
  className?: string
  element?: 'h1' | 'h2' | 'h3'
}

/**
 * Section Title Component.
 * A reusable typography primitive used to standardize the header styles for all major landing page sections.
 * Implements a visually distinct italicized serif font to contrast with the primary UI typeface.
 */
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
