import { createMdxManager } from './mdx-manager'
import type { BlogPost } from '@/types/blog'

const manager = createMdxManager<BlogPost>('blogs', 'blog')

/**
 * Blog Manager
 * Strongly-typed repository pattern exposing access to the MDX blog documents.
 */
export const getBlogSlugs = manager.getSlugs
export const getBlogPost = manager.getPost
export const getAllBlogPosts = manager.getAll
