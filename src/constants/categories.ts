/**
 * Filter Categories
 * Enumerated filter options for sorting and categorizing various content types.
 * Each list is `as const` so its `value`s can be derived into a union type.
 */

/** Project listing filters (web apps, ML, etc.). */
export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Application' },
  { value: 'ml', label: 'Machine Learning' },
] as const

/** Skills section groupings (frontend, backend, tooling, etc.). */
export const SKILL_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'languages', label: 'Languages' },
  { value: 'devops', label: 'Devops' },
  { value: 'tools', label: 'Tools' },
] as const

/** Photo gallery filters by how each image was produced. */
export const PHOTO_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'captured', label: 'Captured' },
  { value: 'generated', label: 'Generated' },
  { value: 'sketched', label: 'Sketched' },
] as const

/** Reading/watching catalog (bookmarks) filters by media type. */
export const CATALOG_CATEGORIES = [
  { value: 'All', label: 'All' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Manga', label: 'Manga' },
  { value: 'Manhwa', label: 'Manhwa' },
  { value: 'Novel', label: 'Novels' },
  { value: 'Book', label: 'Books' },
  { value: 'Game', label: 'Games' },
] as const

/** Blog post filters by writing type. */
export const BLOG_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'personal', label: 'Personal' },
  { value: 'short-notes', label: 'Short Notes' },
] as const
