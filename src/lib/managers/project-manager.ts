import { createMdxManager } from './mdx-manager'
import type { ProjectPostData } from '@/types/project'

const manager = createMdxManager<ProjectPostData>('projects', 'project')

/**
 * Project Manager
 * Strongly-typed repository pattern exposing access to the MDX project documents.
 */
export const getProjectSlugs = manager.getSlugs
export const getProject = manager.getPost
export const getAllProjects = manager.getAll
