'use client'

import { skillRows } from '@/data/static/skills'
import { InfiniteCarousel } from '@/components/ui/infinite-carousel'
import { CarouselButton } from '@/components/ui/carousel-button'
import { SkillCard } from '@/components/skills/skill-card'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import type { Skill } from '@/types/home'

const CAROUSEL_OPTIONS = {
  embla: { dragFree: true },
  autoScroll: { stopOnInteraction: false, speed: 0.6 },
}

const SHARED_CAROUSEL_PROPS = {
  className: '-my-4 py-4',
  containerClassName: 'gap-2 pl-2',
  keyExtractor: (item: Skill) => item.id,
  emblaOptions: CAROUSEL_OPTIONS.embla,
  autoScrollOptions: CAROUSEL_OPTIONS.autoScroll,
  loopMultiplier: 5,
  renderItem: (skill: Skill) => <SkillCard skill={skill} />,
}

/**
 * Renders a dual-row infinite scrolling carousel of tech stack icons.
 * Includes a global keyboard shortcut ('S') to navigate to the full skills directory.
 */
export function Skills() {
  useKeyboardShortcut('S', '/skills')

  return (
    <section id="skills" className="animate-page-simple">
      <div className="relative">
        <div className="mask-fade-l relative flex flex-col gap-2 py-2">
          <InfiniteCarousel
            items={skillRows.firstRow}
            direction="backward"
            ariaLabel="Technical skills first row"
            {...SHARED_CAROUSEL_PROPS}
          />
          <InfiniteCarousel
            items={skillRows.secondRow}
            ariaLabel="Technical skills second row"
            {...SHARED_CAROUSEL_PROPS}
          />
        </div>

        <CarouselButton href="/skills" label="Skills Directory" shortcut="S" />
      </div>
    </section>
  )
}
