'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import { useFluidBlob } from '@/hooks/use-fluid-blob'
import { cn } from '@/utils/utils'

/** Props for {@link ProfilePicture}. */
interface ProfilePictureProps {
  src: string
  alt: string
  className?: string
}

/**
 * Renders a profile picture with an organic, constantly morphing fluid mask.
 * Background threads animate independently for a multilayered effect.
 */
export function ProfilePicture({ src, alt, className }: ProfilePictureProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(containerRef, { margin: '200px' })

  const thread1 = useFluidBlob(1600, true, isInView)
  const thread2 = useFluidBlob(1900, true, isInView)
  const thread3 = useFluidBlob(2200, true, isInView)

  const innerBlob = useFluidBlob(1900, true, isInView)

  return (
    <div
      ref={containerRef}
      className={cn('relative z-10 flex size-16 shrink-0 items-center justify-center', className)}
    >
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: thread1.borderRadius,
          rotate: thread1.rotate,
          scale: thread1.scale,
        }}
        className="absolute -inset-[3.5px] -z-10 border border-primary/80 opacity-70"
      />
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: thread2.borderRadius,
          rotate: thread2.rotate,
          scale: thread2.scale,
        }}
        className="absolute -inset-[3.5px] -z-10 border border-primary/60 opacity-45"
      />
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: thread3.borderRadius,
          rotate: thread3.rotate,
          scale: thread3.scale,
        }}
        className="absolute -inset-[3.5px] -z-10 border border-primary/40 opacity-25"
      />
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: innerBlob.borderRadius,
        }}
        className="relative size-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      >
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          priority
          unoptimized
          className="size-full object-cover"
        />
      </m.div>
    </div>
  )
}
