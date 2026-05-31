'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-background/60 backdrop-blur-md"
          >
            <motion.div
              layoutId={`photo-${photo.id}`}
              transition={ZOOM_EASE}
              className="relative h-[90vh] w-[90vw]"
            >
              <Image src={photo.url} alt={photo.alt} fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
