import type { PROJECT_CATEGORIES } from '@/constants/categories'

/** Derived from the filter list, so a project can only claim a category the filter actually offers */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]['value']

/** A link out of a project, such as its repository or a live site */
interface ProjectLink {
  label: string
  url: string
}

/** A span of work, for projects that ran over a period rather than landing on one date */
interface ProjectPeriod {
  start: string
  end: string
}

/**
 * The frontmatter of one project, as written at the top of its MDX file. Everything optional may
 * simply be left out of the file.
 *
 * A project with external set opens there instead of at its own page, and one marked preview shows
 * as unreleased work rather than as a finished card.
 */
export interface ProjectPostData {
  title: string
  excerpt: string
  date?: string
  slug: string
  type?: ProjectCategory
  period?: ProjectPeriod
  preview?: boolean
  external?: string
  links?: ProjectLink[]
  tech?: string[]
  image?: string
  video?: string
}
