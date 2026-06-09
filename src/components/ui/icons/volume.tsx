'use client'

import { m } from 'framer-motion'
import { type ComponentProps, forwardRef, useImperativeHandle, useState } from 'react'

const VOLUME_SPEAKER_PATH =
  'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'

/** Imperative handle to drive the volume icon's sound wave animation from a parent. */
export interface VolumeIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

/**
 * A speaker icon whose sound waves animate in when `startAnimation()` is called via its ref.
 * Used to give audio feedback (e.g. the name pronunciation button).
 */
export const VolumeIcon = forwardRef<VolumeIconHandle, ComponentProps<'svg'>>((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)

  useImperativeHandle(ref, () => ({
    startAnimation: () => setIsPlaying(true),
    stopAnimation: () => setIsPlaying(false),
  }))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <path d={VOLUME_SPEAKER_PATH} />

      <m.path
        d="M16 9a5 5 0 0 1 0 6"
        initial={false}
        animate={{ opacity: isPlaying ? [0, 1] : 1 }}
        transition={{
          duration: isPlaying ? 0.3 : 0,
          delay: isPlaying ? 0.1 : 0,
        }}
      />
      <m.path
        d="M19.364 18.364a9 9 0 0 0 0-12.728"
        initial={false}
        animate={{ opacity: isPlaying ? [0, 1] : 1 }}
        transition={{
          duration: isPlaying ? 0.3 : 0,
          delay: isPlaying ? 0.2 : 0,
        }}
        onAnimationComplete={() => {
          if (isPlaying) setIsPlaying(false)
        }}
      />
    </svg>
  )
})
VolumeIcon.displayName = 'VolumeIcon'

/** Static volume-on icon used when global sound effects are enabled. */
export function VolumeOnIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 18v3h-2v-3h-2v-2h6v2zM5 18v3H3v-3H1v-2h6v2zm6-12V3h2v3h2v2H9V6zm0 4h2v11h-2zm-8 4V3h2v11zm16 0V3h2v11z" />
    </svg>
  )
}

/** Static volume-off icon used when global sound effects are muted. */
export function VolumeOffIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <g transform="rotate(180 12 12)">
        <path d="M21 18v3h-2v-3h-2v-2h6v2zM5 18v3H3v-3H1v-2h6v2zm6-12V3h2v3h2v2H9V6zm0 4h2v11h-2zm-8 4V3h2v11zm16 0V3h2v11z" />
      </g>
    </svg>
  )
}
