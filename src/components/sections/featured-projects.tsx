'use client'

import { useMemo, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, m } from 'framer-motion'
import { useViews } from '@/components/providers/views-context'
import { ViewAll } from '@/components/ui/view-all'
import { ProjectCard } from '@/components/projects/project-card'
import { EmptyState } from '@/components/common/empty-state'
import { landingPageContent } from '@/data/content/landing-content'
import { SectionTitle } from '@/components/layout/section-title'
import { SPRING_TRANSITION } from '@/constants/ui'
import type { ProjectPostData, ProjectCategory } from '@/types/project'

/** Props for {@link FeaturedProjects}. */
interface FeaturedProjectsProps {
  filterType?: ProjectCategory
  projects: ProjectPostData[]
  searchQuery?: string
}

const { featuredProjects } = landingPageContent.sections

/**
 * Featured Projects Section.
 * A dual purpose component that renders a subset of projects on the home page
 * or acts as the fully searchable/filterable grid on the main `/projects` listing.
 * Animates using the lightweight `m` component injected from the root `MotionProvider`.
 */
export function FeaturedProjects({
  filterType,
  projects,
  searchQuery = '',
}: FeaturedProjectsProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { prefetchViews } = useViews()

  const displayed = useMemo(() => {
    let filtered =
      filterType && filterType !== 'all' ? projects.filter((p) => p.type === filterType) : projects

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query),
      )
    }

    return isHomePage ? filtered.slice(0, 4) : filtered
  }, [projects, filterType, isHomePage, searchQuery])

  useEffect(() => {
    if (displayed.length > 0) {
      prefetchViews(displayed.map((p) => p.slug))
    }
  }, [displayed, prefetchViews])

  return (
    <section id="projects" className="space-y-8 animate-page-simple">
      {isHomePage && <SectionTitle>{featuredProjects.title}</SectionTitle>}

      <>
        <AnimatePresence mode="popLayout">
          {displayed.length > 0 ? (
            <m.div key="project-grid" layout className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {displayed.map((project) => (
                <m.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={SPRING_TRANSITION}
                >
                  <ProjectCard project={project} />
                </m.div>
              ))}
            </m.div>
          ) : (
            <EmptyState key="no-projects" message="no projects found in this category." />
          )}
        </AnimatePresence>
      </>

      {isHomePage && <ViewAll href="/projects" label={featuredProjects.viewAll} />}
    </section>
  )
}
