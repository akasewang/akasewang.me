import { BLOG_CATEGORIES } from '@/constants/categories'

/** Type definitions for blog posts, their frontmatter and UI listings. */

/** A blog post category/type filter value (technical, personal…). */
export type BlogCategory = (typeof BLOG_CATEGORIES)[number]['value']

/** An external or related link displayed on a blog post. */
export interface BlogLink {
  label: string
  url: string
}

/** A blog post's frontmatter plus the metadata needed to render it in listings. */
export interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  type?: BlogCategory
  links?: BlogLink[]
  tags?: string[]
}

/** Static copy for the blogs listing page (headings and empty state messages). */
export interface BlogsListingContent {
  title: string
  subtitle: string
  noTechnical: string
  noPersonal: string
}
