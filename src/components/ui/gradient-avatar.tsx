'use client'

import { memo } from 'react'
import { cn, generateGradientFromName } from '@/utils/utils'

/** Inline SVG fractal noise texture overlaid on the avatar for a subtle grain. */
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`

/** Props for {@link GradientAvatar}. */
interface GradientAvatarProps {
  name: string
  size?: number
  className?: string
}

/**
 * Generates a gradient background based on the provided string (e.g., a username).
 *
 * @param name - The seed string used to generate the deterministic colors and angle.
 * @param size - The pixel width and height of the circular avatar.
 * @param className - Optional CSS classes for custom spacing or overrides.
 */
export const GradientAvatar = memo(function GradientAvatar({
  name,
  size = 30,
  className,
}: GradientAvatarProps) {
  const safeName = name || '?'
  const { colors, angle } = generateGradientFromName(safeName)

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
      }}
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-white/30',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-[radial-gradient(circle_at_top_left,oklch(100% 0 0 / 0.4),transparent_70%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
    </div>
  )
})
