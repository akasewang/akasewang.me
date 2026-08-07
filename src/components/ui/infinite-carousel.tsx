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
  keyExtractor: (item: T, index: number) => string | number
  emblaOptions?: Partial<EmblaOptionsType>
  autoScrollOptions?: Partial<AutoScrollOptionsType>
  ariaLabel?: string
  loopMultiplier?: number
}

/**
 * A row that scrolls on its own and never reaches an end, used for the marquees of cards on the
 * landing page.
 *
 * Scrolling pauses under the pointer so something can be read or clicked, but not on drag, which
 * would otherwise leave the row stopped for good after a stray swipe.
 */
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

  /**
   * The items repeated, since a loop can only be seamless where the row is wider than the screen.
   * A short list is repeated more, having less to fill that width with in the first place.
   */
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
          /* Which item this is, and which pass of the list it belongs to, so copies key apart */
          const originalIndex = index % items.length
          const loopIndex = Math.floor(index / items.length)
          const key = `${keyExtractor(item, originalIndex)}-${loopIndex}`

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
