import path from 'node:path'
import type { ProjectPostData } from '@/types/project'
import { createMdxManager } from './mdx-manager'

const manager = createMdxManager<ProjectPostData>(
  path.join(/* turbopackIgnore: true */ process.cwd(), 'docs', 'projects'),
  'project',
)

/**
 * Project Manager
 * Strongly typed repository pattern exposing access to the MDX project documents.
 */

/** All project slugs, for `generateStaticParams`. */
export const getProjectSlugs = manager.getSlugs
/** A single parsed project by slug, or null if not found. */
export const getProject = manager.getPost
/** All projects, parsed and sorted newest first. */
export const getAllProjects = manager.getAll
