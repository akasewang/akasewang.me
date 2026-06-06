import { Suspense } from 'react'
import { projectsPageContent } from '@/data/content/projects-content'
import { Metadata } from 'next'
import { projectsSeoContent } from '@/data/content/seo-content'
import { ProjectTabs } from '@/components/projects/project-tabs'
import { getAllProjects } from '@/lib/managers/project-manager'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { SITE_URL } from '@/constants/constants'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { PageLayout } from '@/components/layout/page-layout'

/** Statically generated metadata for the Projects listing page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: projectsSeoContent.title,
    description: projectsSeoContent.description,
    path: '/projects',
    image: getOgImageUrl(projectsSeoContent.ogTitle, 'Project'),
    imageAlt: projectsSeoContent.imageAlt,
  })
}

/**
 * Main Projects Listing Route.
 * Fetches all MDX project portfolios server side and wraps the rendering logic in a Suspense
 * boundary so that client side search parameters don't block the initial HTML response.
 */
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
      footerText="If you liked these, wait until you see what I build next."
      breadcrumb={breadcrumbJsonLd}
    >
      <Suspense fallback={null}>
        <ProjectTabs projects={projects} />
      </Suspense>
    </PageLayout>
  )
}
