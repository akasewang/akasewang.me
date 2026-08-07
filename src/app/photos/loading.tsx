import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'

/** Shown while the photos page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      footerText="Taking photos so I don't have to remember things."
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen px-8 pb-12 pt-2 md:px-28 md:pt-12"
    >
      <div className="z-50 mb-6 md:absolute md:bottom-0 md:left-8 md:mb-0 md:top-[calc(3rem-2px)] md:w-8">
        <Skeleton className="size-8 rounded-md bg-surface-20 md:sticky md:top-24" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
          <Skeleton className="h-7 w-16 rounded-full bg-surface-30" />
          <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
          <Skeleton className="h-7 w-24 rounded-full bg-surface-20" />
        </div>

        <div className="columns-1 gap-2 space-y-2 sm:columns-2 sm:gap-2.5 sm:space-y-2.5 lg:columns-3 xl:columns-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="break-inside-avoid overflow-hidden bg-surface-20">
              <Skeleton className="aspect-square w-full bg-surface-20/80" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
