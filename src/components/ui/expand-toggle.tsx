'use client'

import { m } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

interface ExpandToggleProps {
  isExpanded: boolean
  className?: string
}

const FLUID_SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const

/**
 * The control on an expandable row. Two chevrons rather than one turning: apart while the row is
 * closed, meeting in the middle while it is open, so the mark reads as open and shut rather than as
 * an arrow pointing somewhere.
 */
export function ExpandToggle({ isExpanded, className }: ExpandToggleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative flex size-4 items-center justify-center', className)}
    >
      <m.div
        initial={false}
        animate={{ y: isExpanded ? 4 : -3 }}
        transition={FLUID_SPRING}
        className="absolute flex items-center justify-center"
      >
        <Icons.chevronUp className="size-3.5 stroke-[2.5]" />
      </m.div>

      <m.div
        initial={false}
        animate={{ y: isExpanded ? -4 : 3 }}
        transition={FLUID_SPRING}
        className="absolute flex items-center justify-center"
      >
        <Icons.chevronDown className="size-3.5 stroke-[2.5]" />
      </m.div>
    </div>
  )
}
