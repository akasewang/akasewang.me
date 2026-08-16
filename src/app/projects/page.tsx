import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { ProjectTabs } from '@/components/projects/project-tabs'
import { SITE_URL } from '@/constants/constants'
import { projectsPageContent } from '@/data/content/projects-content'
import { projectsSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { getAllProjects } from '@/lib/managers/project-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: projectsSeoContent.title,
  description: projectsSeoContent.description,
  path: '/projects',
  image: getOgImageUrl(projectsSeoContent.ogTitle, 'Project'),
  imageAlt: projectsSeoContent.imageAlt,
})

/** the projects grid, filtered in the browser */
export default async function ProjectsPage() {
  const projects = await getAllProjects()

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Projects', url: `${SITE_URL}/projects` },
  ])

  return (
    <PageLayout
      title={projectsPageContent.title}
      subtitle={projectsPageContent.subtitle}
      footerText={projectsPageContent.footerText}
      breadcrumb={breadcrumbJsonLd}
    >
      <Suspense fallback={null}>
        <ProjectTabs projects={projects} />
      </Suspense>
    </PageLayout>
  )
}
