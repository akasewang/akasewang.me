import path from 'node:path'
import type { BlogPost } from '@/types/blog'
import { createMdxManager } from './mdx-manager'

const manager = createMdxManager<BlogPost>(
  path.join(/* turbopackIgnore: true */ process.cwd(), 'docs', 'blogs'),
  'blog',
)

export const getBlogSlugs = manager.getSlugs

export const getBlogPost = manager.getPost

export const getAllBlogPosts = manager.getAll
