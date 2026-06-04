'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { Portal } from '@/components/ui/portal'
import { ZOOM_EASE } from '@/constants/ui'
import type { Photo } from '@/types/photos'
import { useScrollLock } from '@/hooks/use-scroll-lock'

interface PhotoOverlayProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
}

/**
 * A fullscreen portal overlay that displays a high-resolution version of a photo.
 * Locks the body scroll and traps focus/escape keys while open.
 * Uses Framer Motion's 'm' component to inherit the LazyMotion engine from the parent.
 */
export function PhotoOverlay({ photo, isOpen, onClose }: PhotoOverlayProps) {
  useScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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
              onClick={onClose}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <m.div
              layoutId={`photo-${photo.id}`}
              transition={ZOOM_EASE}
              className="relative z-10 flex transform-gpu overflow-hidden bg-muted/20 shadow-2xl will-change-transform"
              style={{
                // Derive the box size from the photo's aspect ratio so the layout
                // target is known synchronously on mount. Without this, the box would
                // collapse until the high-res image downloads, breaking the first
                // (uncached) zoom animation. Fits within 90vw x 90vh, keeping ratio.
                aspectRatio: `${photo.width} / ${photo.height}`,
                width: `min(90vw, calc(90vh * ${photo.width} / ${photo.height}))`,
              }}
              onClick={onClose}
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
