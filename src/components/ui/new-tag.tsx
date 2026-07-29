'use client'

import { m } from 'framer-motion'
import { SPRING_TRANSITION } from '@/constants/ui'
import { cn } from '@/utils/utils'

interface NewTagProps {
  className?: string
}

export function NewTag({ className }: NewTagProps) {
  return (
    <m.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={SPRING_TRANSITION}
      className={cn('relative inline-flex shrink-0 select-none', className)}
    >
      <div className="relative flex items-center overflow-hidden rounded-full bg-gradient-to-b from-verified to-verified-deep py-[1px] pl-4 pr-3 shadow-[inset_0_1px_1px_rgb(255_255_255/0.2),inset_0_-1px_1px_rgb(0_0_0/0.1)]">
        <span className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 animate-[shimmer_2s_linear_infinite] motion-reduce:animate-none bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <span className="absolute left-2 top-1/2 z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white to-zinc-400 ring-[0.5px] ring-black/20 shadow-[0_1.5px_2px_rgb(0_0_0/0.5),inset_0_-1px_1px_rgb(0_0_0/0.2)]" />

        <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-white [text-shadow:0_1px_1px_rgb(0_0_0/0.1)]">
          New
        </span>
      </div>
    </m.div>
  )
}
