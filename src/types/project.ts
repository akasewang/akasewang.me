import { PROJECT_CATEGORIES } from '@/constants/categories'

/** Type definitions for project entries and MDX frontmatter schemas. */

/** A project category filter value (web, ml…). */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]['value']

/** An external or related link displayed on a project. */
export interface ProjectLink {
  /** Visible link text. */
  label: string
  /** Destination URL. */
  url: string
}

/** The start/end span a project ran over. */
export interface ProjectPeriod {
  /** Start date string. */
  start: string
  /** End date string, or a marker like "Present" for ongoing work. */
  end: string
}

/** A project's MDX frontmatter plus the metadata needed to render it in listings. */
export interface ProjectPostData {
  /** Project title. */
  title: string
  /** Short summary shown in listings and meta tags. */
  excerpt: string
  /** Publish or completion date string. */
  date: string
  /** URL slug, also the MDX file name. */
  slug: string
  /** Optional category the project filter groups the entry under. */
  type?: ProjectCategory
  /** Optional span the project ran over. */
  period?: ProjectPeriod
  /** Optional external or related links. */
  links?: ProjectLink[]
  /** Optional technologies used, rendered as tags. */
  tech?: string[]
  /** Optional cover image path. */
  image?: string
  /** Optional demo video path. */
  video?: string
}
