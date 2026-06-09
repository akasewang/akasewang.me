import path from 'node:path'
import type { BlogPost } from '@/types/blog'
import { createMdxManager } from './mdx-manager'

const manager = createMdxManager<BlogPost>(
  path.join(/* turbopackIgnore: true */ process.cwd(), 'docs', 'blogs'),
  'blog',
)

/**
 * Blog Manager
 * Strongly typed repository pattern exposing access to the MDX blog documents.
 */

/** All blog post slugs, for `generateStaticParams`. */
export const getBlogSlugs = manager.getSlugs
/** A single parsed blog post by slug, or null if not found. */
export const getBlogPost = manager.getPost
/** All blog posts, parsed and sorted newest first. */
export const getAllBlogPosts = manager.getAll
