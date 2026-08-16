'use client'

import Image from 'next/image'
import { TESTIMONIAL_CAPTION_CLASS } from '@/components/skeletons/testimonial-card'
import { GradientAvatar } from '@/components/ui/gradient-avatar'
import { VerifiedIcon } from '@/components/ui/icons'
import { LinkableSpotlightCard } from '@/components/ui/linkable-spotlight-card'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Testimonial } from '@/types/home'
import { cn } from '@/utils/utils'

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

const TESTIMONIAL_CARD_BASE_CLASSES =
  'group relative flex h-full select-none flex-col overflow-hidden rounded-2xl px-6 py-5 focus:outline-none bg-card ring-1 ring-ring retina:ring-[0.5px] transition-transform duration-300 ease-out'

const TESTIMONIAL_FIGURE_CLASSES = 'flex h-full flex-col justify-between'

const TESTIMONIAL_QUOTE_CLASSES =
  'grow text-pretty font-serif text-sm font-medium italic leading-relaxed antialiased'

const TESTIMONIAL_ROLE_CLASSES = 'truncate font-mono text-xs font-medium tracking-tight'

/** One quote with the person it came from */
export function TestimonialCard({
  testimonial: { url, quote, author, role, image, verified },
  className,
}: TestimonialCardProps) {
  const isLink = !!url
  const { navigate: navigateSound } = useSoundEffects()

  /**
   * Drawn twice, once plainly and once as the brighter layer the spotlight reveals through its
   * mask. The reveal copy leaves a blank where the avatar goes rather than loading the image again.
   */
  const renderContent = (isReveal: boolean = false) => (
    <figure className={cn(TESTIMONIAL_FIGURE_CLASSES, isReveal ? 'px-6 py-5' : 'relative z-10')}>
      <blockquote
        className={cn(TESTIMONIAL_QUOTE_CLASSES, isReveal ? 'text-primary' : 'text-foreground')}
      >
        {quote}
      </blockquote>

      <figcaption className={TESTIMONIAL_CAPTION_CLASS}>
        {isReveal ? (
          <div className="size-9 shrink-0" />
        ) : (
          <AuthorAvatar image={image} author={author} isLink={isLink} />
        )}

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1.5 text-xs-plus font-semibold leading-relaxed tracking-tight text-primary">
            <span className="truncate">{author}</span>
            {verified && <VerifiedIcon className="size-3 -mt-[1px] shrink-0 text-verified" />}
          </div>

          {role && (
            <div
              className={cn(
                TESTIMONIAL_ROLE_CLASSES,
                isReveal ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {role}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  )

  return (
    <LinkableSpotlightCard
      href={url}
      revealLayer={renderContent(true)}
      outerSize={250}
      className={cn(
        TESTIMONIAL_CARD_BASE_CLASSES,
        isLink && 'active:scale-[0.98] active:duration-200',
        className,
      )}
      onActivate={navigateSound}
    >
      {renderContent()}
    </LinkableSpotlightCard>
  )
}

function AuthorAvatar({
  image,
  author,
  isLink,
}: {
  image?: string
  author: string
  isLink: boolean
}) {
  const ringClasses = cn(
    'rounded-full ring-1 ring-ring/80 transition-shadow duration-300 retina:ring-[0.5px]',
    isLink && 'supports-hover:group-hover:ring-ring group-active:ring-ring',
  )

  return image ? (
    <Image
      src={image}
      alt={author}
      width={36}
      height={36}
      draggable={false}
      className={cn('size-9 bg-muted object-cover', ringClasses)}
    />
  ) : (
    <div className={ringClasses}>
      <GradientAvatar name={author} size={36} />
    </div>
  )
}
