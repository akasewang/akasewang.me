'use client'

import { cn } from '@/utils/utils'
import { useSpotlight } from '@/hooks/use-spotlight'

/** Props for {@link Spotlight}. */
interface SpotlightProps {
  isHovering: boolean
  outerSize?: number
  children?: React.ReactNode
  /**
   * If true, automatically renders a faintly visible background layer of the children.
   * Perfect for text-reveal effects where the text should remain barely visible when not hovered.
   */
  withBaseReveal?: boolean
}

/**
 * Renders a cursor-following spotlight from layered radial gradients positioned by the
 * `--mx` / `--my` / `--spotlight-intensity` CSS variables (typically set by `useSpotlight`),
 * fading in while `isHovering`. Optionally reveals masked `children` under the light.
 *
 * @param isHovering - Whether the spotlight layers are currently visible.
 * @param outerSize - Base pixel radius for the spotlight gradients. Defaults to 140.
 * @param children - Optional content masked to reveal only directly under the cursor.
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

/** Props for {@link SpotlightCard}; `as` selects the rendered element type. */
export interface SpotlightCardProps<T extends React.ElementType = 'div'> {
  as?: T
  outerSize?: number
  withBaseReveal?: boolean
  revealLayer?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * A highly-optimized container that automatically tracks cursor velocity and applies the Spotlight effect.
 * Completely abstracts away the boilerplate of hooks and refs for the developer.
 * Use `as` to render as a different semantic element (e.g., `as="a"`).
 * Use `revealLayer` to supply completely custom content for the spotlight mask.
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

  return (
    <Comp ref={ref as any} className={cn('relative overflow-hidden', className)} {...props}>
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
