'use client'

import { m } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

interface ExpandToggleProps {
  isExpanded: boolean
  className?: string
}

const FLUID_SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const

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
