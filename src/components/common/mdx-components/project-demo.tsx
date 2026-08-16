'use client'

import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ProjectMediaFallback } from '@/components/common/project-media-fallback'
import { Icons } from '@/components/ui/icons'
import { useMediaFallback } from '@/hooks/use-media-fallback'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { canUseHoverPointer } from '@/utils/pointer'
import { scaledRem } from '@/utils/ui-scale'

interface ProjectDemoProps {
  image?: string
  video?: string
  title: string
}

/**
 * The video or image at the top of a project page, with its own play control and progress bar.
 *
 * Controls fade out while it plays and return on any pointer movement, so they are there when
 * wanted and out of the way otherwise.
 */
export function ProjectDemo({ image, video, title }: ProjectDemoProps) {
  const { hoverCard, media } = useSoundEffects()
  const { failed: videoFailed, onError: onVideoError } = useMediaFallback(video)
  const { failed: imageFailed, ref: imageRef, onError: onImageError } = useMediaFallback(image)

  const showsVideo = Boolean(video) && !videoFailed
  const [state, setState] = useState({
    isPlaying: true,
    isBuffering: true,
    isHovered: false,
    showControls: true,
  })
  const [time, setTime] = useState({ current: 0, duration: 0 })

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  /**
   * Shows the controls and starts the five seconds after which they go again. The override exists
   * because a caller that has just toggled playback knows the new value before state does.
   */
  const resetHideTimer = useCallback(
    (isPlayingOverride = state.isPlaying) => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      updateState({ showControls: true })
      if (isPlayingOverride)
        hideTimerRef.current = setTimeout(() => updateState({ showControls: false }), 5000)
    },
    [state.isPlaying, updateState],
  )

  const togglePlay = () => {
    if (!videoRef.current) return
    const isPlaying = !state.isPlaying
    media(isPlaying)
    if (isPlaying) {
      /** A refused play leaves the control showing paused, which is what actually happened */
      videoRef.current.play().catch(() => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        updateState({ isPlaying: false, showControls: true })
      })
    } else {
      videoRef.current.pause()
    }
    updateState({ isPlaying })
    resetHideTimer(isPlaying)
  }

  const handleToggleClick = (e: MouseEvent) => {
    e.stopPropagation()
    togglePlay()
  }

  const handleToggleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return

    e.preventDefault()
    e.stopPropagation()
    togglePlay()
  }

  /** Where along the bar it was clicked, as a share of the duration */
  const handleSeek = (e: MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current || time.duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickedTime = ((e.clientX - rect.left) / rect.width) * time.duration
    videoRef.current.currentTime = clickedTime
    setTime((prev) => ({ ...prev, current: clickedTime }))
    resetHideTimer()
  }

  /** Clicking away from the player puts the controls away, rather than waiting out the timer */
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        updateState({ showControls: false })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [updateState])

  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    },
    [],
  )

  return (
    <div className="my-8 w-full not-prose" ref={containerRef}>
      <figure
        className="group/demo relative isolate m-0 select-none overflow-hidden rounded-xl border border-border/60 bg-surface-40 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500 retina:border-[0.5px]"
        onPointerEnter={(event) => {
          if (!canUseHoverPointer(event.pointerType)) return

          if (showsVideo) hoverCard()
          updateState({ isHovered: true })
          resetHideTimer()
        }}
        onPointerLeave={() => updateState({ isHovered: false })}
        onPointerMove={(event) => {
          if (canUseHoverPointer(event.pointerType)) resetHideTimer()
        }}
        onClick={showsVideo ? handleToggleClick : undefined}
        onKeyDown={showsVideo ? handleToggleKeyDown : undefined}
        role={showsVideo ? 'button' : undefined}
        tabIndex={showsVideo ? 0 : undefined}
      >
        <div className="relative aspect-video w-full">
          {showsVideo ? (
            <>
              <video
                ref={videoRef}
                src={video}
                autoPlay
                muted
                loop
                playsInline
                onError={onVideoError}
                onTimeUpdate={() => {
                  const videoEl = videoRef.current
                  if (videoEl) {
                    setTime((prev) => ({
                      ...prev,
                      current: videoEl.currentTime,
                    }))
                  }
                }}
                onLoadedMetadata={() =>
                  videoRef.current && setTime({ current: 0, duration: videoRef.current.duration })
                }
                onWaiting={() => updateState({ isBuffering: true })}
                onPlaying={() => {
                  updateState({ isBuffering: false })
                  resetHideTimer(true)
                }}
                className="size-full object-cover"
                poster={imageFailed ? undefined : image}
              />
              <AnimatePresence>
                {state.isBuffering && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-background/40 backdrop-blur-md"
                  >
                    <m.svg
                      viewBox="0 0 50 50"
                      className="size-7"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear',
                      }}
                    >
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-primary/10"
                      />
                      <m.circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-primary"
                        initial={{
                          strokeDasharray: '1, 150',
                          strokeDashoffset: 0,
                        }}
                        animate={{
                          strokeDasharray: ['1, 150', '90, 150', '90, 150'],
                          strokeDashoffset: [0, -35, -124],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: 'easeInOut',
                        }}
                      />
                    </m.svg>
                  </m.div>
                )}
                {(state.isHovered || state.showControls) && !state.isBuffering && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
                  >
                    <m.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="flex size-14 items-center justify-center rounded-full bg-background/80 text-primary shadow-xl backdrop-blur-md"
                    >
                      {state.isPlaying ? (
                        <Icons.pause className="size-6 fill-current" />
                      ) : (
                        <Icons.play className="size-6 fill-current" />
                      )}
                    </m.div>
                    <m.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 h-1.5 w-full bg-black/20 transition-[height] duration-200 supports-hover:hover:h-2.5 active:h-2.5"
                      onClick={handleSeek}
                    >
                      <m.div
                        className="h-full bg-primary"
                        style={{
                          width: `${time.duration > 0 ? (time.current / time.duration) * 100 : 0}%`,
                        }}
                      />
                    </m.div>
                  </m.div>
                )}
              </AnimatePresence>
            </>
          ) : image && !imageFailed ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes={`(max-width: ${scaledRem(800)}) 100vw, ${scaledRem(800)}`}
              className="object-cover"
              priority
              ref={imageRef}
              onError={onImageError}
            />
          ) : (
            <ProjectMediaFallback title={title} />
          )}
        </div>
      </figure>
    </div>
  )
}
