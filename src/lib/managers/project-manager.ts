import path from 'node:path'
import type { ProjectPostData } from '@/types/project'
import { createMdxManager } from './mdx-manager'

/** The project instance of the shared MDX manager, reading from its own content directory */
const manager = createMdxManager<ProjectPostData>(
  path.join(/* turbopackIgnore: true */ process.cwd(), 'docs', 'projects'),
  'project',
)

export const getProjectSlugs = manager.getSlugs

export const getProject = manager.getPost

export const getAllProjects = manager.getAll
