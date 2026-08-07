import { PageLayout } from '@/components/layout/page-layout'
import {
  PROJECT_GRID_CLASS,
  ProjectCardSkeleton,
} from '@/components/projects/project-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { projectsPageContent } from '@/data/content/projects-content'

/** Shown while the projects grid loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={projectsPageContent.title}
      subtitle={projectsPageContent.subtitle}
      footerText="If you liked these, wait until you see what I build next."
    >
      <div className="w-full space-y-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 flex-1 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
            <Skeleton className="size-9 shrink-0 rounded-md bg-surface-20 ring-1 ring-inset ring-ring/40" />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
            <Skeleton className="h-7 w-16 rounded-full bg-surface-30" />
            <Skeleton className="h-7 w-20 rounded-full bg-surface-20" />
            <Skeleton className="h-7 w-24 rounded-full bg-surface-20" />
          </div>
        </div>

        <div className={PROJECT_GRID_CLASS}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
