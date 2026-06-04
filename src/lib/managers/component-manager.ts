import { createMdxManager } from './mdx-manager'
import type { ComponentPost } from '@/types/component'

/** Instantiate a highly-optimized, cached MDX parser specifically tuned for the 'components' directory */
const manager = createMdxManager<ComponentPost>('components', 'component')

/**
 * Component Manager
 * Strongly-typed repository pattern exposing access to the MDX component documents.
 */

/** All component doc slugs, for `generateStaticParams`. */
export const getComponentSlugs = manager.getSlugs
/** A single parsed component doc by slug, or null if not found. */
export const getComponentDoc = manager.getPost
/** All component docs, parsed and sorted newest-first. */
export const getAllComponentDocs = manager.getAll
