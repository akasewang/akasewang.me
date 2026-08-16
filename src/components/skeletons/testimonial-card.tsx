import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'

/**
 * The shell the testimonials page and its skeleton both sit in.
 *
 * This page steps outside the content column the rest of the site reads in and runs the full width
 * of the viewport. Both sides read it from here so they cannot disagree, which would show as the
 * grid jumping from one width to the other the moment the cards arrive.
 */
export const TESTIMONIALS_PAGE_CLASS =
  'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden px-8 md:px-28'

/** The grid the testimonials page and its skeleton both lay out with */
/** The caption row under a quote, the avatar sizing its own column beside the name */
export const TESTIMONIAL_CAPTION_CLASS = 'mt-4 grid grid-cols-[auto_1fr] items-center gap-x-3'

export const TESTIMONIAL_GRID_CLASS =
  'grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4'

/**
 * One quote card.
 *
 * The card is drawn as itself, with the quote and the person it came from left as placeholders, so
 * the ring and the radius are already correct when the words arrive.
 */
export function TestimonialCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full select-none flex-col justify-between rounded-2xl bg-card px-6 py-5 ring-1 ring-ring retina:ring-[0.5px]',
        className,
      )}
    >
      <SkeletonText lines={3} lastLineWidth="w-2/3" />

      <div className={TESTIMONIAL_CAPTION_CLASS}>
        <Skeleton tone="base" className="size-9 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <Skeleton tone="strong" className="h-3 w-28" />
          <Skeleton tone="muted" className="h-3 w-36" />
        </div>
      </div>
    </div>
  )
}
