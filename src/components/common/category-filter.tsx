'use client'

import { m } from 'framer-motion'
import { useId } from 'react'
import { SMOOTH_SPRING_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface CategoryFilterProps<T extends string> {
  categories: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function CategoryFilter<T extends string>({
  categories,
  value,
  onChange,
}: CategoryFilterProps<T>) {
  const { select, hoverTick } = useSoundEffects()
  const id = useId()

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {categories.map(({ value: catValue, label }) => {
        const isActive = value === catValue

        return (
          <m.button
            key={catValue}
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            onClick={() => {
              if (isActive) return
              select()
              onChange(catValue)
            }}
            onMouseEnter={hoverTick}
            className={cn(
              'relative flex min-w-12 items-center justify-center rounded-none px-3 py-1 font-mono text-[13px] font-medium lowercase transition-colors duration-300',
              isActive ? 'text-primary-foreground' : 'text-secondary hover:text-primary',
            )}
          >
            <span className="relative z-10">{label}</span>
            {isActive && (
              <m.div
                layoutId={`active-tab-${id}`}
                className="absolute inset-0 rounded-none bg-primary"
                transition={SMOOTH_SPRING_TRANSITION}
              />
            )}
          </m.button>
        )
      })}
    </div>
  )
}
