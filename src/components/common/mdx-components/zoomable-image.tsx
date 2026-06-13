'use client'

import { m } from 'framer-motion'
import { useState } from 'react'
import { PhotoOverlay } from '@/components/photos/photo-overlay'
import { ZOOM_EASE } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Photo } from '@/types/photos'
import { cn } from '@/utils/utils'

/**
 * Automatically wraps standard Markdown images (`![alt](url)`) and provides a clickable overlay.
 * Reuses the global `<PhotoOverlay>` component for the zoomed state.
 *
 * @example
 * // Default size (Markdown syntax)
 * ![My awesome app dashboard](/images/dashboard.png)
 *
 * @example
 * // Custom size (JSX syntax)
 * <img src="/images/logo.svg" alt="Company Logo" width="400" height="400" />
 *
 * @param props - Standard HTMLImageElement attributes.
 */
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

  const parsedWidth = width ? Number(width) : 1920
  const parsedHeight = height ? Number(height) : 1080

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
        className="block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border/60 text-left"
      >
        <m.div
          layoutId={`photo-${photo.id}`}
          transition={ZOOM_EASE}
          className="relative h-full w-full"
        >
          <img
            src={src as string}
            alt={alt}
            width={width}
            height={height}
            className={cn('h-auto w-full object-cover', className)}
            loading="lazy"
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
