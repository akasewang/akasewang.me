import { BLOG_CATEGORIES } from '@/constants/categories'

/** Type definitions for blog posts, their frontmatter and UI listings. */

/** A blog post category/type filter value (technical, personal…). */
export type BlogCategory = (typeof BLOG_CATEGORIES)[number]['value']

/** An external or related link displayed on a blog post. */
export interface BlogLink {
  /** Visible link text. */
  label: string
  /** Destination URL. */
  url: string
}

/** A blog post's frontmatter plus the metadata needed to render it in listings. */
export interface BlogPost {
  /** Post title. */
  title: string
  /** Short summary shown in listings and meta tags. */
  excerpt: string
  /** Publish date string. */
  date: string
  /** URL slug, also the MDX file name. */
  slug: string
  /** Optional category the blog filter groups the post under, defaults to technical. */
  type?: BlogCategory
  /** Optional external or related links. */
  links?: BlogLink[]
  /** Optional free form tags. */
  tags?: string[]
}

/** Static copy for the blogs listing page (headings and empty state messages). */
export interface BlogsListingContent {
  /** Page heading. */
  title: string
  /** Page subheading. */
  subtitle: string
  /** Empty state shown when the technical filter has no posts. */
  noTechnical: string
  /** Empty state shown when the personal filter has no posts. */
  noPersonal: string
  /** Empty state shown when the short notes filter has no posts. */
  noShortNotes: string
}
