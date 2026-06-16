'use client'

import type { SpotlightMoveState } from '@/hooks/use-spotlight'
import { useSpotlight } from '@/hooks/use-spotlight'
import { cn } from '@/utils/utils'

interface SpotlightProps {
  isHovering: boolean
  outerSize?: number
  children?: React.ReactNode
  withBaseReveal?: boolean
}

function Spotlight({
  isHovering,
  outerSize = 140,
  children,
  withBaseReveal = false,
}: SpotlightProps) {
  const visible = isHovering ? 'opacity-100' : 'opacity-0'

  return (
    <>
      {children && withBaseReveal && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-20">
          {children}
        </div>
      )}

      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out',
          visible,
        )}
        style={{
          willChange: 'opacity, background',
          background: `radial-gradient(${outerSize * 1.6}px circle at var(--mx, 50%) var(--my, 50%), oklch(100% 0 0 / 0.06), transparent 70%)`,
        }}
      />

      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-[400ms] ease-out',
          visible,
        )}
        style={{
          willChange: 'opacity, background',
          background: `radial-gradient(${outerSize}px circle at var(--mx, 50%) var(--my, 50%), oklch(calc(100% - 2% * var(--spotlight-intensity, 0.4)) calc(0.012 * var(--spotlight-intensity, 0.2)) 80 / calc(0.14 * var(--spotlight-intensity, 0.4))), transparent 70%)`,
        }}
      />

      {children && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-20 transition-opacity duration-200 ease-out',
            visible,
          )}
          style={{
            willChange: 'opacity, mask-image',
            WebkitMaskImage: `radial-gradient(${outerSize * 0.4}px circle at var(--mx, 50%) var(--my, 50%), black, transparent)`,
            maskImage: `radial-gradient(${outerSize * 0.4}px circle at var(--mx, 50%) var(--my, 50%), black, transparent)`,
          }}
        >
          {children}
        </div>
      )}
    </>
  )
}

interface SpotlightCardProps<T extends React.ElementType = 'div'> {
  as?: T
  outerSize?: number
  withBaseReveal?: boolean
  revealLayer?: React.ReactNode
  onSpotlightMove?: (state: SpotlightMoveState) => void
  className?: string
  children?: React.ReactNode
}

export function SpotlightCard<T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  outerSize = 140,
  withBaseReveal = false,
  revealLayer,
  onSpotlightMove,
  ...props
}: SpotlightCardProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof SpotlightCardProps<T>>) {
  const { ref, isHovering } = useSpotlight<HTMLElement>({ onMove: onSpotlightMove })
  const Comp = as || 'div'
  const spotlightRef = ref as React.ComponentPropsWithRef<T>['ref']

  return (
    <Comp ref={spotlightRef} className={cn('relative overflow-hidden', className)} {...props}>
      <Spotlight
        isHovering={isHovering}
        outerSize={outerSize}
        withBaseReveal={withBaseReveal && !revealLayer}
      >
        {revealLayer || (withBaseReveal ? children : undefined)}
      </Spotlight>

      {(!withBaseReveal || revealLayer) && children}
    </Comp>
  )
}
