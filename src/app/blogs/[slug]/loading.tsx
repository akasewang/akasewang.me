import { Skeleton } from '@/components/ui/skeleton'

/** Shown while a single post loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <div className="relative space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-3/4 rounded-md bg-surface-30" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-24 rounded bg-surface-20" />
            <Skeleton className="h-3.5 w-16 rounded bg-surface-20" />
            <Skeleton className="h-3.5 w-20 rounded bg-surface-20" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Skeleton className="size-8 rounded-md bg-surface-20" />
          <Skeleton className="size-8 rounded-md bg-surface-20" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded bg-surface-30/70" />
        <Skeleton className="h-4 w-5/6 rounded bg-surface-30/70" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30" />
          <Skeleton className="h-6 w-20 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30" />
          <Skeleton className="h-6 w-14 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/30" />
        </div>
      </div>

      <hr className="border-t border-border" />

      <div className="space-y-4 pt-2">
        <Skeleton className="h-4 w-full rounded bg-surface-30/60" />
        <Skeleton className="h-4 w-11/12 rounded bg-surface-30/60" />
        <Skeleton className="h-4 w-4/5 rounded bg-surface-30/60" />
        <div className="py-2">
          <Skeleton className="h-32 w-full rounded-xl bg-surface-20/60 ring-1 ring-inset ring-ring/30" />
        </div>
        <Skeleton className="h-4 w-full rounded bg-surface-30/60" />
        <Skeleton className="h-4 w-5/6 rounded bg-surface-30/60" />
      </div>
    </div>
  )
}
