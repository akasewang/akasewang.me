import path from 'node:path'
import type { ProjectPostData } from '@/types/project'
import { createMdxManager } from './mdx-manager'

/** The project instance of the shared MDX manager, reading from its own content directory */
const manager = createMdxManager<ProjectPostData>(
  path.join(/* turbopackIgnore: true */ process.cwd(), 'docs', 'projects'),
  'project',
)

export const getProject = manager.getPost

export const getAllProjects = manager.getAll

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
export const getPageProjects = async () =>
  (await getAllProjects()).filter(({ external }) => !external)
