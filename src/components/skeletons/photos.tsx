import { SkeletonCategoryFilter } from '@/components/skeletons/shared'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * The measurements the photos page and the placeholder standing in for it have to agree on, held
 * here and read by the page itself too.
 *
 * The wrapper is the widest of them and the one that matters most: it breaks the page out of the
 * content column to the full viewport, so a difference between the two sides would not shift a row
 * but the whole page under it.
 */
export const PHOTOS_PAGE_CLASS =
  'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen px-8 pb-12 pt-2 md:px-28 md:pt-12'

/** The rail of controls, in flow on narrow screens and pinned beside the grid from md up */
export const PHOTOS_RAIL_CLASS = 'z-50 mb-6 md:absolute md:inset-y-0 md:left-8 md:mb-0 md:w-8'

/** One column, then two, then four. The gap widens once and then holds */
export const PHOTOS_GRID_CLASS = 'grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5 md:grid-cols-4'

/** How many tiles the placeholder lays out, being a screen's worth without running past one */
const PLACEHOLDER_TILES = 12

/** Matches the photo grid while the route streams, from the measurements the page itself draws with */
export function PhotosSkeleton() {
  return (
    <>
      <div className={PHOTOS_RAIL_CLASS}>
        <div className="flex h-8 items-center justify-center md:sticky md:top-24">
          <Skeleton tone="muted" className="size-4.5" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <SkeletonCategoryFilter widths={['w-12', 'w-20', 'w-24', 'w-16']} />
        </div>

        <div className={PHOTOS_GRID_CLASS}>
          {Array.from({ length: PLACEHOLDER_TILES }).map((_, index) => (
            <Skeleton key={index} tone="panel" className="aspect-square w-full rounded-none" />
          ))}
        </div>
      </div>
    </>
  )
}
