import { PROJECT_CATEGORIES } from '@/constants/categories'

/** Type definitions for project entries and MDX frontmatter schemas. */

/** A project category filter value (web, ml…). */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]['value']

/** An external or related link displayed on a project. */
export interface ProjectLink {
  label: string
  url: string
}

/** The start/end span a project ran over. */
export interface ProjectPeriod {
  start: string
  end: string
}

/** A project's MDX frontmatter plus the metadata needed to render it in listings. */
export interface ProjectPostData {
  title: string
  excerpt: string
  date: string
  slug: string
  type?: ProjectCategory
  period?: ProjectPeriod
  links?: ProjectLink[]
  tech?: string[]
  image?: string
  video?: string
}
