'use client'

import { m } from 'framer-motion'
import { BackButton } from '@/components/ui/back-button'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'
import { cn } from '@/utils/utils'

interface MdxFooterProps {
  url: string
  title: string
  quote?: string
  backHref?: string
  backLabel?: string
  className?: string
}

/**
 * MDX Post Footer Component.
 * A layout wrapper for the bottom of individual blog posts and project case studies.
 */
export function MdxFooter({ quote, backHref = '/', backLabel, className }: MdxFooterProps) {
  return (
    <m.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SMOOTH_SPRING_TRANSITION}
      className={cn('space-y-4 pt-6', className)}
    >
      {quote && (
        <blockquote className="max-w-2xl text-pretty font-serif text-base italic leading-relaxed text-muted-foreground">
          {quote}
        </blockquote>
      )}
      <BackButton href={backHref} label={backLabel} />
    </m.footer>
  )
}
