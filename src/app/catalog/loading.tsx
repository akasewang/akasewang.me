import { PageLayout } from '@/components/layout/page-layout'
import { SkeletonCategoryFilter } from '@/components/skeletons/shared'
import { Skeleton } from '@/components/ui/skeleton'
import { catalogPageContent } from '@/data/content/catalog-content'

const ENTRY_WIDTHS = ['w-1/2', 'w-2/5', 'w-3/5', 'w-[45%]']
const AUTHOR_WIDTHS = ['w-24', 'w-32', 'w-20', 'w-28']

/** Shown while the catalog loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={catalogPageContent.title}
      subtitle={catalogPageContent.subtitle}
      footerText={catalogPageContent.footerText}
    >
      <div className="space-y-8">
        <SkeletonCategoryFilter widths={['w-12', 'w-20', 'w-24', 'w-16']} />

        <div className="flex flex-col gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex items-baseline justify-between gap-4">
              <Skeleton
                tone="strong"
                className={`h-3.5 ${ENTRY_WIDTHS[index % ENTRY_WIDTHS.length]}`}
              />
              <Skeleton
                tone="muted"
                className={`h-3.5 shrink-0 ${AUTHOR_WIDTHS[index % AUTHOR_WIDTHS.length]}`}
              />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
