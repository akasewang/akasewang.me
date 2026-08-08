import {
  PROJECT_GRID_CLASS,
  ProjectCardSkeleton,
} from '@/components/projects/project-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shown while the landing page loads, laid out to match it so nothing shifts when the real content
 * arrives.
 *
 * Sits inside the home route group rather than at the root of app, which is what keeps it to this
 * one page. A loading file at the root is the fallback for every route beneath it, so a skeleton
 * shaped like the landing page would appear over the projects grid, the blogs list and the rest.
 */
export default function Loading() {
  return (
    <main className="flex-1">
      <section className="space-y-14">
        <div className="space-y-8">
          <div className="flex items-center gap-6 pb-2">
            <Skeleton className="size-20 shrink-0 rounded-full bg-surface-30" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-48 rounded-md bg-surface-30" />
              <Skeleton className="h-4 w-36 rounded bg-surface-20" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-16 rounded bg-surface-30" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded bg-surface-30/70" />
              <Skeleton className="h-4 w-5/6 rounded bg-surface-30/70" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded bg-surface-20" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-7 w-20 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30"
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-32 rounded bg-surface-20" />
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Skeleton className="h-9 w-36 rounded-md bg-surface-30" />
              <Skeleton className="h-9 w-36 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-20 rounded bg-surface-30" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-7 w-20 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-36 rounded bg-surface-30" />
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <Skeleton className="h-4 w-1/3 rounded bg-surface-30" />
                <Skeleton className="h-3.5 w-24 rounded bg-surface-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-36 rounded bg-surface-30" />
          <div className={PROJECT_GRID_CLASS}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-28 rounded bg-surface-30" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5 py-2 border-b border-border last:border-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/2 rounded bg-surface-30" />
                  <Skeleton className="h-3 w-20 rounded bg-surface-20" />
                </div>
                <Skeleton className="h-3.5 w-3/4 rounded bg-surface-30/60" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-24 rounded bg-surface-30" />
          <div className="space-y-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <Skeleton className="h-4 w-2/5 rounded bg-surface-30" />
                <Skeleton className="h-3.5 w-20 rounded bg-surface-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-28 rounded bg-surface-30" />
          <div className="space-y-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <Skeleton className="h-4 w-2/5 rounded bg-surface-30" />
                <Skeleton className="h-3.5 w-20 rounded bg-surface-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-28 rounded bg-surface-30" />
          <div className="space-y-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <Skeleton className="h-4 w-2/5 rounded bg-surface-30" />
                <Skeleton className="h-3.5 w-20 rounded bg-surface-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-24 rounded bg-surface-30" />
          <div className="space-y-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <Skeleton className="h-4 w-2/5 rounded bg-surface-30" />
                <Skeleton className="h-3.5 w-20 rounded bg-surface-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-24 rounded bg-surface-30" />
          <Skeleton className="h-4 w-3/4 rounded bg-surface-20" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-10 w-full sm:flex-1 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
            <Skeleton className="h-10 w-full sm:w-[140px] shrink-0 rounded-md bg-surface-30" />
          </div>
        </div>
      </section>
    </main>
  )
}
