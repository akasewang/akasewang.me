'use client'

import type { ReactNode } from 'react'
import { SpotlightCard } from './spotlight'

interface LinkableSpotlightCardProps {
  children: ReactNode
  className?: string
  href?: string
  onActivate?: () => void
  outerSize?: number
  revealLayer?: ReactNode
}

/**
 * A spotlight card that may or may not be a link. Given an href it renders as an anchor, so a card
 * that leads somewhere is reachable by keyboard rather than being a div listening for clicks.
 */
export function LinkableSpotlightCard({
  children,
  className,
  href,
  onActivate,
  outerSize,
  revealLayer,
}: LinkableSpotlightCardProps) {
  const commonProps = {
    children,
    className,
    onClick: href ? onActivate : undefined,
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
