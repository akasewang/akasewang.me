/**
 * Filter Categories
 * Enumerated filter options for sorting and categorizing various content types.
 */
export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Application' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'oss', label: 'Open Source' },
] as const

export const SKILL_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'languages', label: 'Languages' },
  { value: 'devops', label: 'Devops' },
  { value: 'tools', label: 'Tools' },
] as const

export const PHOTO_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'captured', label: 'Captured' },
  { value: 'generated', label: 'Generated' },
  { value: 'sketched', label: 'Sketched' },
] as const

export const CATALOG_CATEGORIES = [
  { value: 'All', label: 'All' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Manga', label: 'Manga' },
  { value: 'Manhwa', label: 'Manhwa' },
  { value: 'Novel', label: 'Novels' },
  { value: 'Book', label: 'Books' },
  { value: 'Game', label: 'Games' },
] as const

export const BLOG_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'personal', label: 'Personal' },
] as const
