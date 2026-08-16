import path from 'node:path'
import { cache } from 'react'
import type { ProjectPostData } from '@/types/project'
import { isValidExternalProjectUrl, projectHasPage, sortProjectsNewest } from '@/utils/project'
import { createMdxManager } from './mdx-manager'

/** The project instance of the shared MDX manager, reading from its own content directory */
const manager = createMdxManager<ProjectPostData>(
  path.join(/* turbopackIgnore: true */ process.cwd(), 'docs', 'projects'),
  'project',
)

function validateProject(project: ProjectPostData) {
  const external = project.external?.trim()
  if (external && !isValidExternalProjectUrl(external)) {
    throw new Error(`Project "${project.slug}" has an invalid external URL: ${project.external}`)
  }
}

/** Reads one project and enforces the same destination invariant used by the full index. */
export const getProject = cache(async (slug: string) => {
  const post = await manager.getPost(slug)
  if (post) validateProject(post.data)
  return post
})

/** The validated project index used by every listing and generated surface. */
export const getAllProjects = cache(async () => {
  const projects = await manager.getAll()
  projects.forEach(validateProject)
  return sortProjectsNewest(projects)
})

/**
 * The projects that have a page here, which is not all of them.
 *
 * A project carrying an external link sends every surface that would open it somewhere else: the
 * card, the command palette and the listing all point outward. The page it would otherwise generate
 * is therefore unreachable by any route a reader can take, and what little it could show is a stub,
 * since the writing lives wherever the link goes. It is left ungenerated rather than published as
 * an orphan for search to find, so this is the list to build pages, sitemap entries and previous
 * and next links from. `getAllProjects` remains the list for anything that shows every project,
 * such as the listing itself.
 */
export const getPageProjects = cache(async () => (await getAllProjects()).filter(projectHasPage))
