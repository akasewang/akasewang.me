'use client'

import { m } from 'framer-motion'
import { type ComponentProps, forwardRef, useImperativeHandle, useState } from 'react'

const VOLUME_SPEAKER_PATH =
  'M6.603 10L10 7.22v9.56L6.603 14H3v-4zM2 16h3.889l5.294 4.332a.5.5 0 0 0 .817-.387V4.055a.5.5 0 0 0-.817-.387L5.89 8H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1'

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
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d={VOLUME_SPEAKER_PATH} />

      <m.path
        d="M18 12a5.99 5.99 0 0 0-2.287-4.713l-1.429 1.429A4 4 0 0 1 16 12c0 1.36-.679 2.561-1.716 3.284l1.43 1.43A5.99 5.99 0 0 0 18 12"
        initial={false}
        animate={{ opacity: isPlaying ? [0, 1] : 1 }}
        transition={{
          duration: isPlaying ? 0.3 : 0,
          delay: isPlaying ? 0.1 : 0,
        }}
      />
      <m.path
        d="M23 12c0 3.292-1.446 6.246-3.738 8.262l-1.418-1.418A8.98 8.98 0 0 0 21 12a8.98 8.98 0 0 0-3.155-6.844l1.417-1.418A10.97 10.97 0 0 1 23 12"
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
