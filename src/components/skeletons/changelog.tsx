import { Icons } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'

/**
 * The timeline's geometry, held here and read by the real timeline too.
 *
 * Colour is left out of every one of these, being the only thing the two sides differ on: the real
 * timeline draws its rail in the border colour and its marks in the muted text colour, while the
 * placeholder draws both at a skeleton weight, so a bright line is not threaded through a page of
 * grey blocks. Everything that decides where a thing sits is shared, since a rail that moved on one
 * side alone would leave the placeholder pointing at nothing.
 */
export const CHANGELOG_DAY_CLASS = 'relative pb-3 last:pb-2 sm:pb-6 sm:pl-8 sm:last:pb-2'

export const CHANGELOG_RAIL_CLASS =
  'absolute bottom-0 left-[calc(var(--spacing)*2.375)] hidden w-px border-l border-dashed sm:block retina:border-l-[0.5px]'

export const CHANGELOG_MARK_CLASS = 'absolute left-0 top-0.5 z-10 hidden bg-background sm:block'

export const CHANGELOG_HEADING_CLASS = 'flex items-center gap-2 pt-0.5'

/** The short dashed run between days on narrow screens, where the full rail has nowhere to go */
export const CHANGELOG_STUB_CLASS =
  'absolute left-1/2 h-3 w-px -translate-x-1/2 border-l border-dashed retina:border-l-[0.5px]'

/** Clear of the mark by its own half plus the gap, so the two never touch */
export const CHANGELOG_STUB_ABOVE = 'bottom-[calc(50%_+_var(--spacing)*2.5)]'
export const CHANGELOG_STUB_BELOW = 'top-[calc(50%_+_var(--spacing)*2.5)]'

const SUBJECT_WIDTHS = ['w-3/5', 'w-1/2', 'w-2/3', 'w-[55%]']

/**
 * Shown while the changelog loads, laid out to match it so nothing shifts when the real content
 * arrives.
 *
 * The dashed rail and its commit marks are drawn rather than left out, because they thread the days
 * together and without them the rows read as loose specks down the page. Both take a placeholder
 * tone so the spine sits at the same weight as the blocks around it.
 */
export function ChangelogTimelineSkeleton() {
  return (
    <div className="relative">
      {Array.from({ length: 3 }).map((_, dayIndex) => {
        const isFirst = dayIndex === 0

        return (
          <div key={dayIndex} className={CHANGELOG_DAY_CLASS}>
            <div
              aria-hidden
              className={cn(
                CHANGELOG_RAIL_CLASS,
                'border-skeleton-strong',
                isFirst ? 'top-3' : 'top-0',
              )}
            />

            <div className={cn(CHANGELOG_MARK_CLASS, 'text-skeleton-strong')}>
              <Icons.gitCommit className="size-5" />
            </div>

            <div className={cn(CHANGELOG_HEADING_CLASS, 'text-skeleton-strong')}>
              <span className="relative inline-flex sm:hidden">
                {!isFirst && (
                  <span
                    aria-hidden
                    className={cn(
                      CHANGELOG_STUB_CLASS,
                      'border-skeleton-strong',
                      CHANGELOG_STUB_ABOVE,
                    )}
                  />
                )}
                <Icons.gitCommit className="size-5" />
                <span
                  aria-hidden
                  className={cn(
                    CHANGELOG_STUB_CLASS,
                    'border-skeleton-strong',
                    CHANGELOG_STUB_BELOW,
                  )}
                />
              </span>
              <Skeleton tone="muted" className="h-3.5 w-44" />
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-3">
              {Array.from({ length: isFirst ? 3 : 2 }).map((_, commitIndex) => (
                <div
                  key={commitIndex}
                  className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <Skeleton
                    tone="strong"
                    className={cn(
                      'h-3.5',
                      SUBJECT_WIDTHS[(dayIndex + commitIndex) % SUBJECT_WIDTHS.length],
                    )}
                  />
                  <Skeleton tone="muted" className="h-3.5 w-16 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
