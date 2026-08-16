import { PageLayout } from '@/components/layout/page-layout'
import { PROJECT_GRID_CLASS, ProjectCardSkeleton } from '@/components/skeletons/project-card'
import { SkeletonCategoryFilter, SkeletonSearchRow } from '@/components/skeletons/shared'
import { projectsPageContent } from '@/data/content/projects-content'

/** Shown while the projects grid loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={projectsPageContent.title}
      subtitle={projectsPageContent.subtitle}
      footerText={projectsPageContent.footerText}
    >
      <div className="w-full space-y-6">
        <div className="space-y-8">
          <SkeletonSearchRow />
          <SkeletonCategoryFilter widths={['w-12', 'w-20', 'w-24', 'w-16']} />
        </div>

        <div className={PROJECT_GRID_CLASS}>
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
