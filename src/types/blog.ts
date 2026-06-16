import type { BLOG_CATEGORIES } from '@/constants/categories'

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]['value']
interface BlogLink {
  label: string
  url: string
}

export interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  type?: BlogCategory
  links?: BlogLink[]
  tags?: string[]
}

export interface BlogsListingContent {
  title: string
  subtitle: string
  noTechnical: string
  noPersonal: string
  noShortNotes: string
}
