'use client'

import { useState, useRef, useEffect, type MouseEvent } from 'react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { Icons } from '@/components/ui/icons'

interface ProjectDemoProps {
  image?: string
  video?: string
  title: string
}

/**
 * Supports both video playback with custom controls (play/pause, seek, buffering state)
 * and static image fallbacks.
 *
 * @param image - Optional URL to a static fallback image or video poster.
 * @param video - Optional URL to the video file to be played.
 * @param title - Accessibility title for the media content.
 */
export function ProjectDemo({ image, video, title }: ProjectDemoProps) {
  const [state, setState] = useState({
    isPlaying: true,
    isBuffering: true,
    isHovered: false,
    showControls: true,
  })
  const [time, setTime] = useState({ current: 0, duration: 0 })

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fallbackImage = image || '/default-image-project.webp'

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }))

  const resetHideTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    updateState({ showControls: true })
    if (!state.isPlaying)
      hideTimerRef.current = setTimeout(() => updateState({ showControls: false }), 5000)
  }

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const isPlaying = !state.isPlaying
    isPlaying ? videoRef.current.play() : videoRef.current.pause()
    updateState({ isPlaying })
    resetHideTimer()
  }

  const handleSeek = (e: MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current || time.duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickedTime = ((e.clientX - rect.left) / rect.width) * time.duration
    videoRef.current.currentTime = clickedTime
    setTime((prev) => ({ ...prev, current: clickedTime }))
    resetHideTimer()
  }

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        updateState({ showControls: false })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [state.isPlaying])

  return (
    <div className="my-8 w-full not-prose" ref={containerRef}>
      <figure
        className="group/demo relative isolate m-0 select-none overflow-hidden rounded-xl bg-muted/40 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500"
        onMouseEnter={() => {
          updateState({ isHovered: true })
          resetHideTimer()
        }}
        onMouseLeave={() => updateState({ isHovered: false })}
        onMouseMove={resetHideTimer}
        onClick={togglePlay}
      >
        <div className="relative aspect-video w-full">
          {video ? (
            <>
              <video
                ref={videoRef}
                src={video}
                autoPlay
                muted
                loop
                playsInline
                onTimeUpdate={() =>
                  videoRef.current &&
                  setTime((prev) => ({
                    ...prev,
                    current: videoRef.current!.currentTime,
                  }))
                }
                onLoadedMetadata={() =>
                  videoRef.current && setTime({ current: 0, duration: videoRef.current.duration })
                }
                onWaiting={() => updateState({ isBuffering: true })}
                onPlaying={() => updateState({ isBuffering: false })}
                className="size-full object-cover"
                poster={fallbackImage}
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
                      className="absolute bottom-0 left-0 h-1.5 w-full bg-black/20 transition-[height] duration-200 hover:h-2.5"
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
          ) : (
            <Image
              src={fallbackImage}
              alt={title}
              fill
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-cover"
              priority
            />
          )}
        </div>
      </figure>
    </div>
  )
}
