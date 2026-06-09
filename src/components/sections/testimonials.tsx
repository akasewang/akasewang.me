'use client'

import { useRouter } from 'next/navigation'
import { TestimonialCard } from '@/components/testimonials/testimonial-card'
import { CarouselButton } from '@/components/ui/carousel-button'
import { InfiniteCarousel } from '@/components/ui/infinite-carousel'
import { testimonials } from '@/data/static/testimonials'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Testimonial } from '@/types/home'

const CAROUSEL_OPTIONS = {
  embla: { dragFree: true },
  autoScroll: { stopOnInteraction: false },
}

const SHARED_CAROUSEL_PROPS = {
  className: '-my-4 py-4',
  containerClassName: 'gap-2 pl-2',
  keyExtractor: (item: Testimonial) => item.id,
  emblaOptions: CAROUSEL_OPTIONS.embla,
  autoScrollOptions: CAROUSEL_OPTIONS.autoScroll,
  renderItem: (item: Testimonial) => <TestimonialCard testimonial={item} className="w-[400px]" />,
}

/**
 * Renders a dual row infinite scrolling carousel of client/peer testimonials.
 * Includes a global keyboard shortcut ('T') to navigate to the full testimonials directory.
 */
export function Testimonials() {
  const router = useRouter()
  const { navigate: navigateSound } = useSoundEffects()

  useKeyboardShortcut('T', () => {
    navigateSound()
    router.push('/testimonials')
  })

  return (
    <section id="testimonials" className="animate-page-simple">
      <div className="relative">
        <div className="mask-fade-l relative flex flex-col gap-2 py-2">
          <InfiniteCarousel
            items={testimonials.topRow}
            direction="backward"
            ariaLabel="Client testimonials top row"
            {...SHARED_CAROUSEL_PROPS}
          />
          <InfiniteCarousel
            items={testimonials.bottomRow}
            ariaLabel="Client testimonials bottom row"
            {...SHARED_CAROUSEL_PROPS}
          />
        </div>

        <CarouselButton href="/testimonials" label="Testimonials Directory" shortcut="T" />
      </div>
    </section>
  )
}
