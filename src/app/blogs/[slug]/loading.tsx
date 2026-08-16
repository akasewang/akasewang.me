import { SkeletonMdxBody, SkeletonMdxHeader } from '@/components/skeletons/shared'
import { SkeletonText } from '@/components/ui/skeleton'

/** Shown while a single post loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <div className="relative space-y-6">
      <SkeletonMdxHeader metaWidths={['w-24', 'w-16', 'w-20']} />

      <div className="space-y-2">
        <SkeletonText lines={2} tone="muted" lastLineWidth="w-2/3" />
      </div>

      <div className="pt-2">
        <SkeletonMdxBody />
      </div>
    </div>
  )
}
