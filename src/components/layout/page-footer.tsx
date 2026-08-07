'use client'

import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { BackButton } from '@/components/ui/back-button'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'
import { usePageArriving } from '@/hooks/use-page-arrival'
import { cn } from '@/utils/utils'

interface PageFooterProps {
  text?: ReactNode
  backButtonHref?: string
  className?: string
}

/** The closing line at the foot of a page */
export function PageFooter({ text, backButtonHref = '/', className }: PageFooterProps) {
  const isArriving = usePageArriving()

  return (
    <m.footer
      layout={!isArriving ? 'position' : false}
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
