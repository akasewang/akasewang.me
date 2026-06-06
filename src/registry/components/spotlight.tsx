'use client'

import { cn } from '@/utils/utils'
import { useSpotlight } from '@/registry/hooks/use-spotlight'

/** Props for {@link Spotlight}. */
interface SpotlightProps {
  isHovering: boolean
  outerSize?: number
  children?: React.ReactNode
  /**
   * If true, automatically renders a faintly visible background layer of the children.
   * Perfect for text reveal effects where the text should remain barely visible when not hovered.
   */
  withBaseReveal?: boolean
}

/**
 * Renders a cursor following spotlight from layered radial gradients positioned by the
 * `--mx` / `--my` / `--spotlight-intensity` CSS variables (set by `useSpotlight`), fading
 * in while `isHovering`. Optionally reveals masked `children` under the light. Designed to
 * be installed via the shadcn registry.
 *
 * @param isHovering - Whether the spotlight is currently visible.
 * @param outerSize - Base radius (in pixels) for the spotlight gradients. Defaults to 140.
 * @param children - Optional content revealed under the spotlight mask.
 */
export function Spotlight({
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

/** Props for {@link SpotlightCard}; any extra `div` attributes are forwarded to the container. */
export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  outerSize?: number
  withBaseReveal?: boolean
}

/**
 * A container that automatically tracks cursor velocity and applies the {@link Spotlight}
 * effect, abstracting away the `useSpotlight` hook and ref wiring for the developer.
 */
export function SpotlightCard({
  children,
  className,
  outerSize = 140,
  withBaseReveal = false,
  ...props
}: SpotlightCardProps) {
  const { ref, isHovering } = useSpotlight<HTMLDivElement>()

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
      <Spotlight isHovering={isHovering} outerSize={outerSize} withBaseReveal={withBaseReveal}>
        {withBaseReveal ? children : undefined}
      </Spotlight>

      {!withBaseReveal && children}
    </div>
  )
}
