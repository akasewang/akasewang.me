'use client'

import type { ReactNode } from 'react'
import type { SpotlightMoveState } from '@/hooks/use-spotlight'
import { SpotlightCard } from './spotlight'

interface LinkableSpotlightCardProps {
  children: ReactNode
  className?: string
  href?: string
  onActivate?: () => void
  onSpotlightMove?: (state: SpotlightMoveState) => void
  outerSize?: number
  revealLayer?: ReactNode
}

export function LinkableSpotlightCard({
  children,
  className,
  href,
  onActivate,
  onSpotlightMove,
  outerSize,
  revealLayer,
}: LinkableSpotlightCardProps) {
  const commonProps = {
    children,
    className,
    onClick: href ? onActivate : undefined,
    onSpotlightMove,
    outerSize,
    revealLayer: href ? revealLayer : undefined,
  }

  if (href) {
    return (
      <SpotlightCard
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      />
    )
  }

  return <SpotlightCard as="div" {...commonProps} />
}
