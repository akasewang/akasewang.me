import { createMdxManager } from './mdx-manager'
import type { ComponentPost } from '@/types/component'

/** Instantiate a highly-optimized, cached MDX parser specifically tuned for the 'components' directory */
const manager = createMdxManager<ComponentPost>('components', 'component')

/**
 * Component Manager
 * Strongly-typed repository pattern exposing access to the MDX component documents.
 */
export const getComponentSlugs = manager.getSlugs
export const getComponentDoc = manager.getPost
export const getAllComponentDocs = manager.getAll
