'use client'

import { m, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useEffect, useRef } from 'react'
import { ViewCounter } from '@/components/common/view-counter'
import { NewTag } from '@/components/ui/new-tag'
import { SPRING_TRANSITION } from '@/constants/ui'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { ProjectPostData } from '@/types/project'
import { formatDateString, isNew } from '@/utils/utils'

/** Props for {@link ProjectCard}. */
interface ProjectCardProps {
  project: ProjectPostData
}

/**
 * Project card for the projects grid. Shows a video or image preview with a hover revealed
 * title, date and view count and automatically plays/pauses the background video based on
 * scroll intersection to save battery and bandwidth.
 */
export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const { title, slug, video, image, date, period, external } = project
  const { hoverCard, navigate: navigateSound } = useSoundEffects()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(containerRef, { amount: 0.5 })

  useEffect(() => {
    if (!videoRef.current) return

    if (isInView) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isInView])

  const displayDate = period
    ? `${formatDateString(period.start)} - ${formatDateString(period.end)}`
    : formatDateString(date)

  return (
    <m.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={SPRING_TRANSITION}
    >
      <Link
        href={external || `/projects/${slug}`}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        prefetch={!external ? false : undefined}
        onMouseEnter={hoverCard}
        onClick={navigateSound}
        className="group block w-full rounded-xl"
      >
        <div
          ref={containerRef}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-card ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] transition-[box-shadow,transform,scale] duration-300 ease-out md:group-hover:ring-ring md:group-hover:shadow-2xl md:active:scale-[0.98] md:active:duration-200 md:active:shadow-none"
        >
          {video ? (
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="none"
              className="absolute inset-0 h-full w-full object-cover transition-[transform,scale] duration-500 ease-out md:group-hover:scale-[1.03]"
            />
          ) : (
            <Image
              src={image || '/default-image-project.webp'}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover transition-[transform,scale] duration-500 ease-out md:group-hover:scale-[1.03]"
            />
          )}

          <div className="pointer-events-none absolute inset-0 hidden bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/40 md:block" />

          {isNew(date) && (
            <div className="absolute left-3 top-3 z-20">
              <NewTag />
            </div>
          )}

          {displayDate && (
            <div className="absolute right-4 top-3 z-20 hidden -translate-y-0.5 opacity-0 transition-[translate,opacity] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:block">
              <span className="font-mono text-[13px] text-white/40">{displayDate}</span>
            </div>
          )}

          <div className="absolute inset-0 hidden flex-col justify-end px-4 py-3 text-white md:flex">
            <div className="flex translate-y-1 items-end justify-between opacity-0 transition-[translate,opacity] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="text-balance text-base font-medium leading-tight tracking-tight text-white drop-shadow-md">
                {title}
              </h3>
              <div className="font-mono text-xs text-white/40">
                <ViewCounter slug={slug} readOnly />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between px-0.5 md:hidden">
          <div className="flex flex-col gap-1">
            <h3 className="text-balance text-sm font-medium leading-tight tracking-tight text-foreground">
              {title}
            </h3>
            {displayDate && (
              <span className="font-mono text-[13px] leading-none text-muted-foreground">
                {displayDate}
              </span>
            )}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            <ViewCounter slug={slug} readOnly />
          </div>
        </div>
      </Link>
    </m.div>
  )
})
