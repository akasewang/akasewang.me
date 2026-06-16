import type { PROJECT_CATEGORIES } from '@/constants/categories'

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]['value']
interface ProjectLink {
  label: string
  url: string
}

interface ProjectPeriod {
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
  external?: string
  links?: ProjectLink[]
  tech?: string[]
  image?: string
  video?: string
}
