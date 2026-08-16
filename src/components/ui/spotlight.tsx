'use client'

import { useSpotlight } from '@/hooks/use-spotlight'
import { cn } from '@/utils/utils'

interface SpotlightProps {
  isHovering: boolean
  outerSize?: number
  children?: React.ReactNode
  withBaseReveal?: boolean
}

/**
 * A pool of light that follows the pointer across a card.
 *
 * Two gradients are stacked, a wide faint one and a tighter brighter one, which together fall off
 * more like real light than a single circle does. Both are centred on CSS variables the hook writes
 * as the pointer moves, so following it costs no re-render.
 *
 * With withBaseReveal the children are also laid down faintly underneath, so whatever the light
 * picks out is dimly visible before the pointer ever reaches it.
 */
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
          willChange: isHovering ? 'opacity, background' : undefined,
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
          willChange: isHovering ? 'opacity, background' : undefined,
          background: `radial-gradient(${outerSize}px circle at var(--mx, 50%) var(--my, 50%), oklch(calc(100% - 2% * var(--spotlight-intensity, 0.4)) calc(0.012 * var(--spotlight-intensity, 0.2)) 80 / calc(0.14 * var(--spotlight-intensity, 0.4))), transparent 70%)`,
        }}
      />

      {/* The children again at full strength, masked to a tighter circle so only what the pointer
          is over is fully lit */}
      {children && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-20 transition-opacity duration-200 ease-out',
            visible,
          )}
          style={{
            willChange: isHovering ? 'opacity, mask-image' : undefined,
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
  className?: string
  children?: React.ReactNode
}

/**
 * A card that lights up under the pointer, wrapping its own children in the spotlight above.
 *
 * The element rendered is the caller's to choose, so a card can be a link or an article without
 * nesting anything extra. Pass revealLayer to light something other than the children, which suits
 * a card whose lit state is a different picture rather than a brighter copy of the same one.
 */
export function SpotlightCard<T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  outerSize = 140,
  withBaseReveal = false,
  revealLayer,
  ...props
}: SpotlightCardProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof SpotlightCardProps<T>>) {
  const { ref, isHovering } = useSpotlight<HTMLElement>()
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
