import { PageLayout } from '@/components/layout/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { skillsPageContent } from '@/data/content/skills-content'

const CHIP_WIDTHS = ['w-14', 'w-20', 'w-16', 'w-24', 'w-18', 'w-22', 'w-16', 'w-20']

/** Shown while the skills grid loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={skillsPageContent.title}
      subtitle={skillsPageContent.subtitle}
      footerText="That's the stack. No more, no less (well, maybe a little more)."
    >
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
          <Skeleton className="h-7 w-16 rounded-full bg-surface-30" />
          <Skeleton className="h-7 w-24 rounded-full bg-surface-20" />
          <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
          <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface-20/50 px-2.5 py-1.5 ring-1 ring-inset ring-ring/40"
            >
              <Skeleton className="size-[13px] shrink-0 rounded-sm bg-surface-30" />
              <Skeleton
                className={`h-3 rounded bg-surface-30/70 ${CHIP_WIDTHS[i % CHIP_WIDTHS.length]}`}
              />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
