import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'

/**
 * The pieces every loading state is assembled from.
 *
 * Each one matches the size and layout of the component it stands in for, so a page holds its shape
 * as the real content arrives. Structure comes from spacing and tonal weight alone: none of these
 * draw a rule between rows, since a hairline in a skeleton reads as content that never turns up.
 */

/**
 * The serif heading above a section of the landing page.
 *
 * The bar is shorter than the line it stands for and centred inside a box of the heading's full
 * height. That way it reads as a word rather than a slab, while the section still takes up the
 * height the real heading will.
 */
export function SkeletonSectionTitle({ className }: { className?: string }) {
  return (
    <div className="flex h-7 items-center">
      <Skeleton tone="strong" className={cn('h-5 w-40', className)} />
    </div>
  )
}

/**
 * The wrapping row the hero sets its socials and its buttons in, read by both of those and by the
 * placeholder standing in for them, so a gap changed in one place cannot reflow only the other two.
 */
export const HERO_ROW_CLASS = 'flex flex-wrap items-center gap-x-3 gap-y-1'

/** The row the chips sit in, read by the real filter too so the two cannot space differently */
export const CATEGORY_FILTER_ROW_CLASS = 'flex flex-wrap items-center gap-x-1 gap-y-2'

/**
 * The row of category chips above a filtered list.
 *
 * Square, as the real chips are, with the first carrying the weight of the selected one.
 */
export function SkeletonCategoryFilter({ widths }: { widths: string[] }) {
  return (
    <div className={CATEGORY_FILTER_ROW_CLASS}>
      {widths.map((width, index) => (
        <Skeleton
          key={index}
          tone={index === 0 ? 'strong' : 'muted'}
          className={cn('h-6 rounded-none', width)}
        />
      ))}
    </div>
  )
}

/** The radius and ring every field and button carries, matching the real form controls */
const FORM_CONTROL_CLASS = 'rounded-lg ring-1 ring-inset ring-ring retina:ring-[0.5px]'

/** A text field, at the height the real input stands at */
export function SkeletonField({ className }: { className?: string }) {
  return <Skeleton tone="panel" className={cn('h-10 w-full', FORM_CONTROL_CLASS, className)} />
}

/** A button, at the height the real one stands at and full width until there is room beside it */
export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton tone="muted" className={cn('h-9 w-full sm:w-36', FORM_CONTROL_CLASS, className)} />
  )
}

/** The search field and its sort control, drawn flat as the real one is */
export function SkeletonSearchRow() {
  return (
    <div className="flex h-9 items-center gap-3">
      <Skeleton tone="muted" className="size-4 shrink-0" />
      <Skeleton tone="muted" className="h-3.5 w-28" />
      <Skeleton tone="muted" className="ml-auto h-3.5 w-24 shrink-0" />
    </div>
  )
}

/** A run of the small labels listed against a project or a post */
export function SkeletonTagRow({ widths, className }: { widths: string[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {widths.map((width, index) => (
        <Skeleton
          key={index}
          tone="muted"
          className={cn(
            'h-4.5 rounded-md ring-1 ring-inset ring-ring/50 retina:ring-[0.5px]',
            width,
          )}
        />
      ))}
    </div>
  )
}

/** The date, the view count and the reading time under a title */
function SkeletonMetaRow({ widths }: { widths: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {widths.map((width, index) => (
        <Skeleton key={index} tone="muted" className={cn('h-3', width)} />
      ))}
    </div>
  )
}

const TIMELINE_TITLE_WIDTHS = ['w-52', 'w-64', 'w-44', 'w-56']
const TIMELINE_SUBTITLE_WIDTHS = ['w-36', 'w-28', 'w-40', 'w-32']

/**
 * A timeline of roles, courses or awards.
 *
 * The dates sit against the far edge on a wide screen and drop under the title on a narrow one,
 * which is where the real rows put them.
 */
export function SkeletonTimelineList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <div className="flex flex-col gap-2">
              <Skeleton
                tone="strong"
                className={cn('h-4', TIMELINE_TITLE_WIDTHS[index % TIMELINE_TITLE_WIDTHS.length])}
              />
              <Skeleton
                tone="muted"
                className={cn(
                  'h-3.5',
                  TIMELINE_SUBTITLE_WIDTHS[index % TIMELINE_SUBTITLE_WIDTHS.length],
                )}
              />
            </div>
            <Skeleton tone="muted" className="h-3.5 w-32 shrink-0" />
          </div>
        ))}
      </div>

      <Skeleton tone="muted" className="mt-6 h-3.5 w-16" />
    </div>
  )
}

const POST_TITLE_WIDTHS = ['w-3/5', 'w-1/2', 'w-2/3', 'w-[55%]']

/** The posts listing: a title with its date opposite, and the standfirst beneath */
export function SkeletonPostList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <Skeleton
              tone="strong"
              className={cn('h-4', POST_TITLE_WIDTHS[index % POST_TITLE_WIDTHS.length])}
            />
            <Skeleton tone="muted" className="h-3 w-32 shrink-0" />
          </div>
          <SkeletonText lines={2} lastLineWidth="w-2/5" />
        </div>
      ))}
    </div>
  )
}

/** The title of a post or project with its meta, and the controls that sit beside it */
export function SkeletonMdxHeader({ metaWidths }: { metaWidths: string[] }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex h-8.25 items-center">
          <Skeleton tone="strong" className="h-6 w-64 sm:w-96" />
        </div>
        <SkeletonMetaRow widths={metaWidths} />
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} tone="panel" className="size-8 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

/** The body of a post: prose either side of a block that stands in for a figure or a code sample */
export function SkeletonMdxBody() {
  return (
    <div className="space-y-6">
      <SkeletonText lines={4} lastLineWidth="w-2/3" />
      <Skeleton tone="panel" className="h-32 w-full rounded-lg" />
      <SkeletonText lines={3} lastLineWidth="w-1/2" />
    </div>
  )
}
