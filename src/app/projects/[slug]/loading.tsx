import { PROJECT_CARD_ASPECT } from '@/components/skeletons/project-card'
import { SkeletonMdxBody, SkeletonMdxHeader, SkeletonTagRow } from '@/components/skeletons/shared'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

/** Shown while a single project loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <div className="relative space-y-6">
      <SkeletonMdxHeader metaWidths={['w-24', 'w-16']} />

      <div className="space-y-2">
        <SkeletonText lines={2} tone="muted" lastLineWidth="w-2/3" />
        <SkeletonTagRow widths={['w-16', 'w-20', 'w-14', 'w-24']} className="pt-2" />
      </div>

      <div className="my-8 w-full">
        <Skeleton
          tone="panel"
          className={`${PROJECT_CARD_ASPECT} w-full rounded-xl ring-1 ring-inset ring-ring/80 retina:ring-[0.5px]`}
        />
      </div>

      <div className="pt-2">
        <SkeletonMdxBody />
      </div>
    </div>
  )
}
