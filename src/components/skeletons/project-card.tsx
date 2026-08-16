import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'

/** Shared by the card and its skeleton, so nothing resizes when the real one arrives */
export const PROJECT_CARD_ASPECT = 'aspect-video'

/** The grid both the projects listing and its skeleton lay out with */
export const PROJECT_GRID_CLASS = 'grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5'

/** The frame of a project card, holding its radius and ring while the media loads */
export function ProjectCardSkeleton() {
  return (
    <Skeleton
      tone="panel"
      className={cn(
        PROJECT_CARD_ASPECT,
        'w-full rounded-xl ring-1 ring-inset ring-ring/80 retina:ring-[0.5px]',
      )}
    />
  )
}
