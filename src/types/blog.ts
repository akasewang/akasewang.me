import type { BLOG_CATEGORIES } from '@/constants/categories'

/** Derived from the filter list, so a post can only claim a category the filter actually offers */
export type BlogCategory = (typeof BLOG_CATEGORIES)[number]['value']

/** A link out of a post, shown in its header */
interface BlogLink {
  label: string
  url: string
}

/**
 * The frontmatter of one post, as written at the top of its MDX file. Everything optional may
 * simply be left out of the file.
 */
export interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  type?: BlogCategory
  links?: BlogLink[]
}

/** Copy for the listing page, including what it says when a filter matches nothing */
export interface BlogsListingContent {
  /** The closing line under the page */
  footerText: string
  title: string
  subtitle: string
  noTechnical: string
  noPersonal: string
}
