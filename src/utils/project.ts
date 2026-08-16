import type { ProjectPostData } from '@/types/project'
import { formatDateString, parseAnyDate } from '@/utils/utils'

type ProjectTarget = Pick<ProjectPostData, 'slug' | 'external'>

/** Where a project link goes, and whether that is off this site */
export interface ProjectDestination {
  href: string
  external: boolean
}

/** One destination rule shared by cards, command results, counts, routes and generated URLs. */
export function getProjectDestination({ slug, external }: ProjectTarget): ProjectDestination {
  const externalHref = external?.trim()

  return externalHref
    ? { href: externalHref, external: true }
    : { href: `/projects/${slug}`, external: false }
}

/** External projects deliberately have no detail route on this site. */
export function projectHasPage(project: ProjectTarget) {
  return !getProjectDestination(project).external
}

/** External project destinations are authored content, but still have to be safe web URLs. */
export function isValidExternalProjectUrl(external: string) {
  try {
    const url = new URL(external)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/** Searches the project metadata readers can see or reasonably expect to search by. */
export function matchesProjectSearch(project: ProjectPostData, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true

  const searchable = [
    project.title,
    project.slug,
    project.excerpt,
    project.type,
    ...(project.tech ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return terms.every((term) => searchable.includes(term))
}

/** A point date wins; otherwise a period sorts and timestamps by its end, then its start. */
export function getProjectEffectiveDate(project: Pick<ProjectPostData, 'date' | 'period'>) {
  if (project.date) return project.date
  if (project.period?.end && parseAnyDate(project.period.end)) return project.period.end
  return project.period?.start
}

/** Human-readable project timing shared by cards, commands and detail headers. */
export function formatProjectDate(project: Pick<ProjectPostData, 'date' | 'period'>) {
  if (project.period) {
    return `${formatDateString(project.period.start)} - ${formatDateString(project.period.end)}`
  }

  return formatDateString(project.date)
}

/** Projects use their effective date rather than generic MDX's optional point date for ordering. */
export function sortProjectsNewest<T extends ProjectPostData>(projects: readonly T[]) {
  return [...projects].sort((left, right) => {
    const leftTime = parseAnyDate(getProjectEffectiveDate(left))?.getTime() ?? 0
    const rightTime = parseAnyDate(getProjectEffectiveDate(right))?.getTime() ?? 0
    return rightTime - leftTime
  })
}
