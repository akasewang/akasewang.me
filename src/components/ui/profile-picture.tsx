'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import { useFluidBlob } from '@/hooks/use-fluid-blob'
import { cn } from '@/utils/utils'

interface ProfilePictureProps {
  src: string
  alt: string
  className?: string
}

/**
 * Renders a profile picture with an organic, constantly morphing fluid mask.
 * Background threads animate independently for a multi-layered effect.
 */
export function ProfilePicture({ src, alt, className }: ProfilePictureProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(containerRef, { margin: '200px' })

  const thread1 = useFluidBlob(3200, true, isInView)
  const thread2 = useFluidBlob(3800, true, isInView)
  const thread3 = useFluidBlob(4400, true, isInView)

  const innerBlob = useFluidBlob(2700, false, isInView)

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
        className="absolute -inset-1 -z-10 border-[1.5px] border-primary opacity-60"
      />
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: thread2.borderRadius,
          rotate: thread2.rotate,
          scale: thread2.scale,
        }}
        className="absolute -inset-1 -z-10 border-[1.5px] border-primary opacity-50"
      />
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: thread3.borderRadius,
          rotate: thread3.rotate,
          scale: thread3.scale,
        }}
        className="absolute -inset-1 -z-10 border-[1.5px] border-primary opacity-40"
      />
      <m.div
        suppressHydrationWarning
        style={{
          borderRadius: innerBlob.borderRadius,
          scale: innerBlob.scale,
        }}
        className="relative size-full overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
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
