import 'server-only'
import { cache } from 'react'
import { commandContent } from '@/data/content/command-content'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getAllProjects } from '@/lib/managers/project-manager'
import type { CommandGroup } from '@/types/command'
import { formatDateString } from '@/utils/utils'

export const getContentCommandGroups = cache(async (): Promise<CommandGroup[]> => {
  const [posts, projects] = await Promise.all([getAllBlogPosts(), getAllProjects()])

  return [
    {
      id: 'blogs',
      label: commandContent.groups.blogs,
      items: posts.map(({ slug, title, date, tags }) => ({
        id: `blog-${slug}`,
        label: title,
        icon: 'blogs' as const,
        meta: formatDateString(date),
        keywords: ['writing', 'post', ...(tags ?? [])],
        href: `/blogs/${slug}`,
      })),
    },
    {
      id: 'projects',
      label: commandContent.groups.projects,
      items: projects.map(({ slug, title, date, tech, external }) => ({
        id: `project-${slug}`,
        label: title,
        icon: 'projects' as const,
        meta: formatDateString(date),
        keywords: ['work', 'build', ...(tech ?? [])],
        /** Projects that live elsewhere open at their source, the rest open their own MDX page */
        href: external || `/projects/${slug}`,
        external: Boolean(external),
      })),
    },
  ].filter((group) => group.items.length > 0)
})
