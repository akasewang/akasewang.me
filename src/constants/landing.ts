/**
 * The landing page's sections, in the order it stacks them.
 *
 * The page and its loading skeleton both render from this list, so removing a section here drops it
 * from both. Each keys a record in those two files, which a missing or surplus entry fails to
 * typecheck, so the skeleton cannot quietly go on describing a section that is gone.
 */
export const LANDING_SECTIONS = [
  'hero',
  'skills',
  'experience',
  /* 'volunteer', */
  'technicalTraining',
  'featuredProjects',
  'featuredPosts',
  /* 'testimonials', */
  'education',
  'achievements',
  'certifications',
  'bookmarks',
  'newsletter',
] as const

export type LandingSection = (typeof LANDING_SECTIONS)[number]
