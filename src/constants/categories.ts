/**
 * The option lists behind every category filter on the site. Each one is both the set of values a
 * filter accepts and the order its chips are drawn in, and the first entry is the default: category
 * state resolves anything unrecognised back to it and leaves it out of the URL, so reordering these
 * changes what a bare path shows.
 */

/**
 * Projects listing filter. The values are what a project file writes in its type frontmatter.
 *
 * Each label says what a project is for, not what it is built with. The stack is listed per
 * project in its tech field. A project with no type shows only under All.
 */
export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'creative', label: 'Creative Tools' },
  { value: 'portfolio', label: 'Portfolio' },
] as const

/** Skills grid filter. Every skill in the landing content carries one of these as its category */
export const SKILL_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'languages', label: 'Languages' },
  { value: 'devops', label: 'Devops' },
  { value: 'tools', label: 'Tools' },
] as const

/** Photos page filter, splitting the set by how an image came about rather than by subject */
export const PHOTO_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'captured', label: 'Captured' },
  { value: 'generated', label: 'Generated' },
] as const

/**
 * Catalog filter, one entry per medium. Capitalised throughout, including the default, because
 * these values are what a catalog entry stores as its category, so the filter and the data it
 * matches against stay written the same way.
 */
export const CATALOG_CATEGORIES = [
  { value: 'All', label: 'All' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Manga', label: 'Manga' },
  { value: 'Manhwa', label: 'Manhwa' },
  { value: 'Novel', label: 'Novels' },
  { value: 'Book', label: 'Books' },
  { value: 'Game', label: 'Games' },
] as const

/**
 * Groups the social links instead of filtering them, so unlike the lists above there is no all
 * entry: every group is shown at once. Order here is the order the hero renders the groups in, so
 * it reads as a priority list. socialGroups is built from this and leaves out any group that has no
 * links, so a group appears the moment its first link does.
 */
export const SOCIAL_CATEGORIES = [
  { value: 'code', label: 'code' },
  { value: 'design', label: 'design' },
  { value: 'practice', label: 'practice' },
  { value: 'security', label: 'security' },
  { value: 'network', label: 'network' },
  { value: 'social', label: 'social' },
  { value: 'media', label: 'media' },
] as const

/** Blogs listing filter. The values are what a post writes in its type frontmatter */
export const BLOG_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'personal', label: 'Personal' },
] as const
