'use client'

import { memo } from 'react'
import { cn, generateGradientFromName } from '@/utils/utils'

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`

interface GradientAvatarProps {
  name: string
  /** What the avatar measures at the reader's base size, before the interface scale is applied */
  size?: number
  className?: string
}

/**
 * Stands in for a photo on the message board, giving each name its own gradient.
 *
 * The colours come from the name itself, so the same person is always drawn the same way with
 * nothing stored, and a little noise is laid over it to keep the blend from banding.
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
        /** In rem so the avatar grows with the names beside it rather than holding a flat size */
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
        backgroundImage: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
      }}
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-white/30 retina:ring-[0.5px]',
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
