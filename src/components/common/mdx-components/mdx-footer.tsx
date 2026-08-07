'use client'

import { m } from 'framer-motion'
import { BackButton } from '@/components/ui/back-button'
import { SMOOTH_SPRING_TRANSITION } from '@/constants/ui'
import { useArrivedWithPage } from '@/hooks/use-page-arrival'
import { cn } from '@/utils/utils'

interface MdxFooterProps {
  url: string
  title: string
  quote?: string
  backHref?: string
  backLabel?: string
  className?: string
}

/** The closing note under a post, with a way back to the listing */
export function MdxFooter({ quote, backHref = '/', backLabel, className }: MdxFooterProps) {
  const arrivedWithPage = useArrivedWithPage()

  return (
    <m.footer
      initial={arrivedWithPage ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SMOOTH_SPRING_TRANSITION}
      className={cn('mt-10 space-y-4', className)}
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
