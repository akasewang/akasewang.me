/**
 * The first entry of each list is the default. Category state resolves anything unrecognised back
 * to it and leaves it out of the URL, so reordering these changes what a bare path shows.
 */
export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web Application' },
  { value: 'ml', label: 'Machine Learning' },
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

/**
 * Order here is the order the hero renders the groups in, so it reads as a priority list. Unlike the
 * filter categories above there is no all entry, since every group is shown at once.
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

export const BLOG_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'personal', label: 'Personal' },
  { value: 'short-notes', label: 'Short Notes' },
] as const
