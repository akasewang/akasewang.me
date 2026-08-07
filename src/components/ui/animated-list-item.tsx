'use client'

import { type HTMLMotionProps, m } from 'framer-motion'
import { SPRING_TRANSITION } from '@/constants/ui'
import { useArrivedWithPage, usePageArriving } from '@/hooks/use-page-arrival'

/**
 * Fades and scales a list item in as it arrives and out as it is filtered away.
 *
 * An item that came in with the page skips its entrance, the page slide being motion enough on
 * its own without every row animating underneath it.
 */
export function AnimatedListItem(props: HTMLMotionProps<'div'>) {
  const isArriving = usePageArriving()
  const arrivedWithPage = useArrivedWithPage()

  return (
    <m.div
      layout={!isArriving}
      initial={arrivedWithPage ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={SPRING_TRANSITION}
      {...props}
    />
  )
}
