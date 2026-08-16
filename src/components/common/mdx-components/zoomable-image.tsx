'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { PhotoOverlay } from '@/components/photos/photo-overlay'
import { ZOOM_EASE } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Photo } from '@/types/photos'
import { cn } from '@/utils/utils'

/** An image in a post that opens full screen when clicked */
export function ZoomableImage({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { zoom, hoverCard } = useSoundEffects()
  const [isOpen, setIsOpen] = useState(false)

  /** Markdown rarely states a size, and next/image needs one to reserve the space */
  const parsedWidth = width ? Number(width) : 1920
  const parsedHeight = height ? Number(height) : 1080

  /** Dressed as a photo so it can reuse the photos page overlay rather than a second one */
  const photo: Photo = {
    id: (src as string) || 'mdx-image',
    url: (src as string) || '',
    alt: alt || 'MDX Image',
    width: parsedWidth,
    height: parsedHeight,
  }

  return (
    <figure className="m-0 my-6 block w-full">
      <button
        type="button"
        onClick={() => {
          zoom(true)
          setIsOpen(true)
        }}
        onMouseEnter={hoverCard}
        className="block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border/60 text-left retina:border-[0.5px]"
      >
        {/** The shared id is what lets the image travel into the overlay rather than cross fade */}
        <m.div
          layoutId={`photo-${photo.id}`}
          transition={ZOOM_EASE}
          className="relative h-full w-full"
        >
          <Image
            src={src as string}
            alt={alt || 'MDX image'}
            width={parsedWidth}
            height={parsedHeight}
            className={cn('h-auto w-full object-cover', className)}
            {...props}
          />
        </m.div>
      </button>

      {alt && (
        <figcaption className="mt-2.5 block text-center text-balance italic text-xs leading-normal text-muted-foreground/50">
          {alt}
        </figcaption>
      )}

      <PhotoOverlay photo={photo} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </figure>
  )
}
