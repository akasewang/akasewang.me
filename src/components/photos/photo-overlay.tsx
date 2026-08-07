'use client'

import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useEffectEvent } from 'react'
import { Portal } from '@/components/ui/portal'
import { ZOOM_EASE } from '@/constants/ui'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Photo } from '@/types/photos'

interface PhotoOverlayProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
}

/** A photo opened full screen, steppable through the rest with the arrow keys */
export function PhotoOverlay({ photo, isOpen, onClose }: PhotoOverlayProps) {
  const { zoom } = useSoundEffects()
  useScrollLock(isOpen)

  const handleClose = useCallback(() => {
    zoom(false)
    onClose()
  }, [onClose, zoom])
  const closeFromEffect = useEffectEvent(handleClose)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFromEffect()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

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
              className="relative z-10 flex transform-gpu overflow-hidden bg-surface-20 shadow-2xl"
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
