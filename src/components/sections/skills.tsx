'use client'

import { useRouter } from 'next/navigation'
import { SkillCard } from '@/components/skills/skill-card'
import { CarouselButton } from '@/components/ui/carousel-button'
import { InfiniteCarousel } from '@/components/ui/infinite-carousel'
import { skillRows } from '@/data/static/skills'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Skill } from '@/types/home'

/** Free dragging with a slow drift that picks itself back up after being dragged */
const CAROUSEL_OPTIONS = {
  embla: { dragFree: true },
  autoScroll: { stopOnInteraction: false, speed: 0.6 },
}

/** Both rows are the same carousel, differing only in their contents and which way they drift */

const SHARED_CAROUSEL_PROPS = {
  className: '-my-4 py-4',
  containerClassName: 'gap-2 pl-2',
  keyExtractor: (item: Skill) => item.id,
  emblaOptions: CAROUSEL_OPTIONS.embla,
  autoScrollOptions: CAROUSEL_OPTIONS.autoScroll,
  loopMultiplier: 5,
  renderItem: (skill: Skill) => <SkillCard skill={skill} />,
}

/** The skills carousel on the landing page */
export function Skills() {
  const router = useRouter()
  const { navigate: navigateSound } = useSoundEffects()

  useKeyboardShortcut('S', () => {
    navigateSound()
    router.push('/skills', { scroll: false })
  })

  return (
    <section id="skills">
      <div className="relative">
        <div className="mask-fade-x relative flex flex-col gap-2 py-2">
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
