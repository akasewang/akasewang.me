import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'

/**
 * The measurements a bubble and the placeholder standing in for it have to agree on, held here and
 * read by the real bubble too, so neither can drift from the other. A gap changed on one side alone
 * shows as the page shifting the moment real messages replace their skeletons.
 */

/** Bubbles stop short of the full width, so the two sides of the exchange stay visibly apart */
export const BUBBLE_WIDTH_CLASS = 'max-w-[85%] sm:max-w-[70%]'

/** The bubble itself, less whichever corner and colour tell the two sides apart */
export const BUBBLE_BASE_CLASS =
  'min-w-37.5 px-4 py-3 rounded-2xl ring-1 ring-inset retina:ring-[0.5px]'

/** The reply sits opposite its message, which is what puts the two sides of the exchange apart */
export const REPLY_ROW_CLASS = 'mt-2 flex items-start justify-end gap-2.5'

const COLUMN_CLASS = cn('flex flex-col', BUBBLE_WIDTH_CLASS)

/**
 * The placeholders for an exchange, shared by the board's own page and by a post's board while its
 * first read is in flight. Both draw the same messages, so both wait on the same shapes.
 */

/** A message left by a visitor, avatar first and the bubble squared off against it */
export function IncomingMessageSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex items-start gap-2.5">
      <Skeleton tone="base" className="mt-0.5 size-8 shrink-0 rounded-full" />
      <div className={cn(COLUMN_CLASS, 'items-start')}>
        <div className={cn(BUBBLE_BASE_CLASS, 'bg-skeleton-panel rounded-tl-sm ring-ring/40')}>
          <Skeleton tone="muted" className="mb-2 h-3 w-20" />
          <SkeletonText lines={lines} lastLineWidth="w-40" />
          <Skeleton tone="muted" className="ml-auto mt-2.5 h-2.5 w-10" />
        </div>
      </div>
    </div>
  )
}

/**
 * The owner's reply, which sits opposite and carries its own accent.
 *
 * The lines inside are tinted with that accent rather than left the grey the other bubble uses,
 * since a grey line on a blue ground reads as a mistake rather than as something loading. They keep
 * the same order of weight the text they stand for has: the message over the name over the time.
 *
 * The bubble itself does not pulse. The shared highlight is a near neutral grey, which over a
 * saturated ground washes the colour out rather than dimming it, so the blue would go dull twice a
 * cycle. Only the lines breathe, and the bubble holds still behind them.
 */
export function ReplyMessageSkeleton() {
  return (
    <div className={REPLY_ROW_CLASS}>
      <div className={cn(COLUMN_CLASS, 'items-end')}>
        <div className={cn(BUBBLE_BASE_CLASS, 'rounded-tr-sm bg-verified/12 ring-verified/25')}>
          <Skeleton className="mb-2 h-3 w-24 bg-verified/30" />
          <Skeleton className="h-3.5 w-44 bg-verified/45" />
          <Skeleton className="mr-auto mt-2.5 h-2.5 w-10 bg-verified/25" />
        </div>
      </div>
      <Skeleton tone="base" className="mt-0.5 size-8 shrink-0 rounded-full" />
    </div>
  )
}
