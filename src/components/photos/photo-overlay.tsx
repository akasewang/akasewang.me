'use client'

import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { Portal } from '@/components/ui/portal'
import { ZOOM_EASE } from '@/constants/ui'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Photo } from '@/types/photos'

/** Props for {@link PhotoOverlay}; `photo` is `null` when nothing is zoomed. */
interface PhotoOverlayProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
}

/**
 * A fullscreen portal overlay that displays a high resolution version of a photo.
 * Locks body scroll while open and closes on Escape or a backdrop/image click.
 * Uses Framer Motion's `m` component to inherit the LazyMotion engine from the parent, with a
 * shared `layoutId` so the grid thumbnail morphs into the overlay.
 */
export function PhotoOverlay({ photo, isOpen, onClose }: PhotoOverlayProps) {
  const { zoom } = useSoundEffects()
  useScrollLock(isOpen)

  const handleClose = useCallback(() => {
    zoom(false)
    onClose()
  }, [onClose, zoom])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, isOpen])

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && photo && (
          <div className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <m.div
              layoutId={`photo-${photo.id}`}
              transition={ZOOM_EASE}
              className="relative z-10 flex transform-gpu overflow-hidden bg-muted/20 shadow-2xl will-change-transform"
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
                width: `min(90vw, calc(90vh * ${photo.width} / ${photo.height}))`,
              }}
              onClick={handleClose}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="size-full object-cover"
                priority
              />
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
