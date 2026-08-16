'use client'

import { m } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useId, useState } from 'react'
import { CATEGORY_FILTER_ROW_CLASS } from '@/components/skeletons/shared'
import { SMOOTH_SPRING_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface CategoryFilterProps<T extends string> {
  categories: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/** The row of category chips above a filtered list */
export function CategoryFilter<T extends string>({
  categories,
  value,
  onChange,
}: CategoryFilterProps<T>) {
  const { select, hoverTick } = useSoundEffects()
  /**
   * The sliding block below is shared by whichever chips carry the same layout id. Keying it to the
   * route as well as the instance stops the filter on an arriving page from animating its block
   * across from the page being left, which are two different lists that happen to look alike.
   */
  const reactId = useId()
  const pathname = usePathname()
  const [id] = useState(() => `${reactId}-${pathname}`)

  return (
    <div className={CATEGORY_FILTER_ROW_CLASS}>
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
              'relative flex min-w-12 items-center justify-center rounded-none px-3 py-0.5 font-mono text-xs-plus font-medium lowercase transition-colors duration-300',
              isActive
                ? 'text-primary-foreground'
                : 'text-secondary supports-hover:hover:text-primary active:text-primary',
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
