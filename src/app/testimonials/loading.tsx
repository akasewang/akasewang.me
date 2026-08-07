import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { testimonialsPageContent } from '@/data/content/testimonials-content'

/** Shown while the testimonials page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={testimonialsPageContent.title}
      subtitle={testimonialsPageContent.subtitle}
      footerText="Words from folks I've had the pleasure of building with."
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl bg-card p-6 ring-1 ring-ring/80 retina:ring-[0.5px] space-y-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded bg-surface-30/70" />
              <Skeleton className="h-3.5 w-5/6 rounded bg-surface-30/70" />
              <Skeleton className="h-3.5 w-2/3 rounded bg-surface-30/70" />
            </div>

            <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-3">
              <Skeleton className="size-9 shrink-0 rounded-full bg-surface-30 ring-1 ring-ring/80" />
              <div className="space-y-1.5 flex min-w-0 flex-col">
                <Skeleton className="h-3.5 w-28 rounded bg-surface-30" />
                <Skeleton className="h-3 w-36 rounded bg-surface-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
