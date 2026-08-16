import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/utils'

/** Cycled so a grid of chips varies the way a list of real names does */
export const SKILL_CHIP_WIDTHS = ['w-14', 'w-20', 'w-16', 'w-24', 'w-12', 'w-18']

/**
 * One chip in the skills grid.
 *
 * The chip body is drawn as the real surface, with its own background and ring. Only the icon and
 * the name inside it are placeholders.
 */
export function SkillCardSkeleton({ width }: { width: string }) {
  return (
    <div className="inline-flex shrink-0 select-none items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-ring retina:ring-[0.5px]">
      <Skeleton tone="base" className="size-3.25 shrink-0" />
      <Skeleton tone="base" className={cn('h-3', width)} />
    </div>
  )
}
