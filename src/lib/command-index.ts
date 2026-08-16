import 'server-only'
import { cache } from 'react'
import { commandContent } from '@/data/content/command-content'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getAllProjects } from '@/lib/managers/project-manager'
import type { CommandGroup } from '@/types/command'
import { formatProjectDate, getProjectDestination } from '@/utils/project'
import { formatDateString } from '@/utils/utils'

/**
 * Turns the written content into the groups the command menu searches. Wrapped in cache so the
 * layout building it and anything else asking during the same request read one result.
 */
export const getContentCommandGroups = cache(async (): Promise<CommandGroup[]> => {
  const [posts, projects] = await Promise.all([getAllBlogPosts(), getAllProjects()])

  return [
    {
      id: 'blogs',
      label: commandContent.groups.blogs,
      items: posts.map(({ slug, title, date, excerpt }) => ({
        id: `blog-${slug}`,
        kind: 'link' as const,
        label: title,
        icon: 'blogs' as const,
        meta: formatDateString(date),
        excerpt,
        keywords: ['writing', 'post'],
        href: `/blogs/${slug}`,
      })),
    },
    {
      id: 'projects',
      label: commandContent.groups.projects,
      items: projects.map((project) => {
        const { slug, title, date, excerpt, tech } = project
        /** A project either has a page here or lives somewhere else entirely */
        const destination = getProjectDestination(project)

        return {
          id: `project-${slug}`,
          kind: 'link' as const,
          label: title,
          icon: 'projects' as const,
          meta: formatProjectDate({ date, period: project.period }),
          excerpt,
          keywords: ['work', 'build', ...(tech ?? [])],
          href: destination.href,
          external: destination.external,
          /** Only a link leaving the site needs its visit counted here, a page counts its own */
          visitSlug: destination.external ? slug : undefined,
        }
      }),
    },
    /** An empty group would otherwise show as a heading with nothing under it */
  ].filter((group) => group.items.length > 0)
})
