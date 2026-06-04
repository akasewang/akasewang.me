'use client'

import { type ReactNode } from 'react'
import { m } from 'framer-motion'
import { BackButton } from '@/components/ui/back-button'
import { cn } from '@/utils/utils'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

interface PageFooterProps {
  text?: ReactNode
  backButtonHref?: string
  className?: string
}

/**
 * Page Footer Component.
 * A consistent layout wrapper used at the bottom of main listing pages.
 */
export function PageFooter({ text, backButtonHref = '/', className }: PageFooterProps) {
  return (
    <m.footer
      layout
      transition={SMOOTH_SPRING_TRANSITION}
      className={cn('space-y-4 pt-8', className)}
    >
      {text && (
        <p className="text-pretty text-base font-serif italic leading-relaxed text-muted-foreground">
          {text}
        </p>
      )}
      <BackButton href={backButtonHref} />
    </m.footer>
  )
}
