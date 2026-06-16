'use client'

import type { EmblaOptionsType } from 'embla-carousel'
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { type ReactNode, useMemo } from 'react'
import { cn } from '@/utils/utils'

interface InfiniteCarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  direction?: 'forward' | 'backward'
  speed?: number
  className?: string
  containerClassName?: string
  slideClassName?: string
  keyExtractor?: (item: T, index: number) => string | number
  emblaOptions?: Partial<EmblaOptionsType>
  autoScrollOptions?: Partial<AutoScrollOptionsType>
  ariaLabel?: string
  loopMultiplier?: number
}

export function InfiniteCarousel<T>({
  items,
  renderItem,
  direction = 'forward',
  speed = 0.8,
  className,
  containerClassName,
  slideClassName,
  keyExtractor,
  emblaOptions,
  autoScrollOptions,
  ariaLabel = 'Carousel',
  loopMultiplier,
}: InfiniteCarouselProps<T>) {
  const plugins = useMemo(
    () => [
      AutoScroll({
        playOnInit: true,
        speed,
        direction,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        startDelay: 0,
        ...autoScrollOptions,
      }),
    ],
    [direction, speed, autoScrollOptions],
  )

  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, containScroll: false, ...emblaOptions },
    plugins,
  )

  const displayItems = useMemo(
    () =>
      Array(loopMultiplier ?? (items.length < 5 ? 4 : 2))
        .fill(items)
        .flat(),
    [items, loopMultiplier],
  )

  return (
    <div
      ref={emblaRef}
      className={cn('overflow-hidden', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className={cn('flex touch-pan-y will-change-transform', containerClassName)}>
        {displayItems.map((item, index) => {
          const originalIndex = index % items.length
          const loopIndex = Math.floor(index / items.length)
          const key = keyExtractor ? `${keyExtractor(item, originalIndex)}-${loopIndex}` : index

          return (
            <div
              key={key}
              role="group"
              aria-roledescription="slide"
              className={cn('flex shrink-0', slideClassName)}
            >
              {renderItem(item, originalIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
