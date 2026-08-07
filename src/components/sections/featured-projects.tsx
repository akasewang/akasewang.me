'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import { SectionTitle } from '@/components/layout/section-title'
import { ProjectCard } from '@/components/projects/project-card'
import { PROJECT_GRID_CLASS } from '@/components/projects/project-card-skeleton'
import { useViews } from '@/components/providers/views-context'
import { AnimatedListItem } from '@/components/ui/animated-list-item'
import { ViewAll } from '@/components/ui/view-all'
import { landingPageContent } from '@/data/content/landing-content'
import { usePageArriving } from '@/hooks/use-page-arrival'
import { countKeyFor } from '@/hooks/use-visits'
import type { ProjectCategory, ProjectPostData } from '@/types/project'

interface FeaturedProjectsProps {
  filterType?: ProjectCategory
  projects: ProjectPostData[]
  searchQuery?: string
  isHomePage?: boolean
}

const { featuredProjects } = landingPageContent.sections

/** The projects grid, shortened to a handful on the landing page and complete on its own */
export function FeaturedProjects({
  filterType,
  projects,
  searchQuery = '',
  isHomePage = false,
}: FeaturedProjectsProps) {
  const isArriving = usePageArriving()
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
      prefetchViews(displayed.map(countKeyFor))
    }
  }, [displayed, prefetchViews])

  return (
    <section id="projects" className="space-y-8">
      {isHomePage && <SectionTitle>{featuredProjects.title}</SectionTitle>}

      <AnimatePresence mode="popLayout">
        {displayed.length > 0 ? (
          <m.div
            key="project-grid"
            layout={!isArriving ? 'position' : false}
            className={PROJECT_GRID_CLASS}
          >
            {displayed.map((project) => (
              <AnimatedListItem key={project.slug}>
                <ProjectCard project={project} />
              </AnimatedListItem>
            ))}
          </m.div>
        ) : (
          <EmptyState key="no-projects" message="no projects found in this category." />
        )}
      </AnimatePresence>

      {isHomePage && <ViewAll href="/projects" label={featuredProjects.viewAll} />}
    </section>
  )
}
