import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { catalogPageContent } from '@/data/content/catalog-content'

/** Shown while the catalog loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={catalogPageContent.title}
      subtitle={catalogPageContent.subtitle}
      footerText="That's a wrap. Now, what should I read or watch next?"
    >
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
          <Skeleton className="h-7 w-16 rounded-full bg-surface-30" />
          <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
          <Skeleton className="h-7 w-24 rounded-full bg-surface-20" />
          <Skeleton className="h-7 w-16 rounded-full bg-surface-20" />
        </div>

        <div className="flex flex-col">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-4 border-b border-border py-3 font-mono last:border-0"
            >
              <Skeleton className="h-4 w-1/2 rounded bg-surface-30" />
              <Skeleton className="h-3.5 w-24 rounded bg-surface-20" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
