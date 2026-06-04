'use client'

import { forwardRef, useImperativeHandle, useState, type ComponentProps } from 'react'
import { m } from 'framer-motion'

export interface VolumeIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

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
      {...props}
    >
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />

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
