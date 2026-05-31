'use client'

import Image from 'next/image'
import { SpotlightCard } from '@/components/ui/spotlight'
import { cn } from '@/utils/utils'
import type { Skill } from '@/types/home'

interface SkillCardProps {
  skill: Skill
  className?: string
}

const SKILL_CARD_BASE_CLASSES =
  'group relative inline-flex select-none items-center gap-1.5 overflow-hidden rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-ring transition-all duration-200 ease-out focus:outline-none retina:ring-[0.5px]'

const SKILL_NAME_BASE_CLASSES = 'whitespace-nowrap font-mono text-xs font-medium leading-none'

/** Skill Card Component. */
export function SkillCard({ skill: { url, icon, name }, className }: SkillCardProps) {
  const isLink = !!url

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
            unoptimized
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

  const commonProps = {
    revealLayer: isLink ? renderContent(true) : undefined,
    outerSize: 120,
    className: cn(SKILL_CARD_BASE_CLASSES, isLink && 'active:scale-[0.97]', className),
  }

  if (isLink) {
    return (
      <SpotlightCard as="a" href={url} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {renderContent()}
      </SpotlightCard>
    )
  }

  return (
    <SpotlightCard as="div" {...commonProps}>
      {renderContent()}
    </SpotlightCard>
  )
}
