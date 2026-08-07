'use client'

import Image from 'next/image'
import { memo } from 'react'
import { MarqueeField } from '@/components/common/marquee-field'
import { ProjectMediaFallback } from '@/components/common/project-media-fallback'
import { ViewCounter } from '@/components/common/view-counter'
import { VisitCounter } from '@/components/common/visit-counter'
import { PROJECT_CARD_ASPECT } from '@/components/projects/project-card-skeleton'
import { Link } from '@/components/ui/route-link'
import { useCursorParallax } from '@/hooks/use-cursor-parallax'
import { useInViewVideo } from '@/hooks/use-in-view-video'
import { useMediaFallback } from '@/hooks/use-media-fallback'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useVisits } from '@/hooks/use-visits'
import type { ProjectPostData } from '@/types/project'
import { cn, formatDateString } from '@/utils/utils'

interface ProjectCardProps {
  project: ProjectPostData
}

/** Its own outline is dropped in favour of the ring drawn on the surface below */
const LINK_CLASS = 'group block w-full rounded-xl outline-none'

const SURFACE_CLASS = `relative ${PROJECT_CARD_ASPECT} w-full overflow-hidden rounded-xl bg-card ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] transition-[box-shadow,transform,scale] duration-300 ease-out group-focus-visible:ring-2 group-focus-visible:ring-primary/60 supports-hover:group-hover:ring-ring supports-hover:group-hover:shadow-2xl md:active:ring-ring md:active:scale-[0.98] md:active:duration-200 md:active:shadow-none`

/**
 * Media drifts with the pointer and grows slightly under it. The offset is read from variables the
 * parallax hook writes, so following the pointer costs no re-render, and both fall back to zero
 * where nothing has written them.
 */
const MEDIA_MOTION =
  'transition-[scale,translate] duration-500 ease-out [translate:var(--parallax-x,0px)_var(--parallax-y,0px)] supports-hover:group-hover:scale-[1.03]'

const MEDIA_CLASS = `object-cover ${MEDIA_MOTION}`

const META_CLASS = 'font-mono text-[13px] text-foreground'

/**
 * Whatever the card has to show, in order of preference: unreleased work gets the marquee, then a
 * video, then an image, then the placeholder.
 *
 * A file named in frontmatter can still be missing, so each is asked whether it actually loaded and
 * a failure falls through to the next choice the same way an absence does.
 */
function CardMedia({
  project,
  videoRef,
}: {
  project: ProjectPostData
  videoRef: React.Ref<HTMLVideoElement>
}) {
  const { title, video, image, preview } = project
  const { failed: videoFailed, onError: onVideoError } = useMediaFallback(video)
  const { failed: imageFailed, ref: imageRef, onError: onImageError } = useMediaFallback(image)

  if (preview) {
    return (
      <MarqueeField text="COMING SOON" label={`${title}, coming soon`} className={MEDIA_MOTION} />
    )
  }

  if (video && !videoFailed) {
    return (
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="none"
        onError={onVideoError}
        className={cn('absolute inset-0 h-full w-full', MEDIA_CLASS)}
      />
    )
  }

  if (image && !imageFailed) {
    return (
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, 400px"
        ref={imageRef}
        onError={onImageError}
        className={MEDIA_CLASS}
      />
    )
  }

  return <ProjectMediaFallback title={title} className={MEDIA_MOTION} />
}

/**
 * One project in the grid.
 *
 * The date, the counter and the title all rest on the media and lift in together on hover. Where
 * the pointer cannot hover they simply stay put, a tap on a card following its link rather than
 * revealing anything.
 *
 * A project with external set opens at its source, and its counter reports visits sent there rather
 * than views of a page here.
 */
export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const { title, slug, date, period, external, preview } = project
  const { hoverCard, navigate: navigateSound } = useSoundEffects()
  const { containerRef, videoRef } = useInViewVideo()
  const { recordVisit } = useVisits()
  const { ref: parallaxRef, onPointerMove, onPointerLeave } = useCursorParallax<HTMLAnchorElement>()

  const displayDate = period
    ? `${formatDateString(period.start)} - ${formatDateString(period.end)}`
    : formatDateString(date)

  return (
    <Link
      href={external || `/projects/${slug}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      prefetch={!external ? false : undefined}
      ref={parallaxRef}
      onMouseEnter={hoverCard}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={() => {
        navigateSound()
        if (external) recordVisit(slug)
      }}
      className={LINK_CLASS}
    >
      <div ref={containerRef} className={SURFACE_CLASS}>
        <CardMedia project={project} videoRef={videoRef} />

        {/* Darkens under the text on hover, and stays dark where there is no hover to trigger it */}
        <div className="pointer-events-none absolute inset-0 bg-black/55 transition-opacity duration-300 ease-out supports-hover:opacity-0 supports-hover:group-hover:opacity-100" />

        {/* A hairline of light along the top edge, which lifts the card off the page */}
        <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]" />

        {displayDate && (
          <div
            className={cn(
              'absolute left-4 top-3 z-20 transition-[translate,opacity] duration-300 ease-out supports-hover:-translate-y-0.5 supports-hover:opacity-0 supports-hover:group-hover:translate-y-0 supports-hover:group-hover:opacity-100',
              META_CLASS,
              /* Unreleased work has a date but not one worth reading, so it is shown out of focus
                 and left unannounced */
              preview && 'select-none blur-[2px]',
            )}
            aria-hidden={preview || undefined}
          >
            {displayDate}
          </div>
        )}

        <div className="absolute inset-0 text-white transition-[translate,opacity] duration-300 ease-out supports-hover:translate-y-1 supports-hover:opacity-0 supports-hover:group-hover:translate-y-0 supports-hover:group-hover:opacity-100">
          <div className={cn('absolute right-4 top-3', META_CLASS)}>
            {external ? <VisitCounter slug={slug} /> : <ViewCounter slug={slug} readOnly />}
          </div>

          <h3 className="absolute inset-x-4 bottom-3 text-balance text-base font-medium leading-tight tracking-tight text-white drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
})
