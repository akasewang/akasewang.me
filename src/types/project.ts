import { PROJECT_CATEGORIES } from '@/constants/categories'

/** Type definitions for project entries and MDX frontmatter schemas. */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]['value']

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectPeriod {
  start: string
  end: string
}

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
