'use client'

import Image from 'next/image'
import { LinkableSpotlightCard } from '@/components/ui/linkable-spotlight-card'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Skill } from '@/types/home'
import { cn } from '@/utils/utils'

interface SkillCardProps {
  skill: Skill
  className?: string
}

const SKILL_CARD_BASE_CLASSES =
  'group relative inline-flex select-none items-center gap-1.5 overflow-hidden rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-ring transition-[box-shadow,transform,scale] duration-200 ease-out focus:outline-none retina:ring-[0.5px]'

const SKILL_NAME_BASE_CLASSES = 'whitespace-nowrap font-mono text-xs font-medium leading-none'

/** One technology in the skills grid, with its icon */
export function SkillCard({ skill: { url, icon, name }, className }: SkillCardProps) {
  const isLink = !!url
  const { spotlightSweep, navigate: navigateSound } = useSoundEffects()

  const renderContent = (isReveal: boolean = false) => {
    const inner = (
      <>
        {isReveal ? (
          <div className="size-[13px] shrink-0" />
        ) : (
          <Image
            src={icon}
            alt={name}
            width={13}
            height={13}
            draggable={false}
            className="relative z-10 size-[13px] shrink-0 object-contain"
          />
        )}
        <span
          className={cn(
            SKILL_NAME_BASE_CLASSES,
            isReveal ? 'text-primary' : 'relative z-10 text-secondary',
          )}
        >
          {name}
        </span>
      </>
    )

    if (isReveal) {
      return <div className="flex size-full items-center gap-1.5 px-2.5 py-1.5">{inner}</div>
    }

    return inner
  }

  return (
    <LinkableSpotlightCard
      href={url}
      revealLayer={renderContent(true)}
      outerSize={120}
      className={cn(SKILL_CARD_BASE_CLASSES, isLink && 'active:scale-[0.97]', className)}
      onSpotlightMove={spotlightSweep}
      onActivate={navigateSound}
    >
      {renderContent()}
    </LinkableSpotlightCard>
  )
}
