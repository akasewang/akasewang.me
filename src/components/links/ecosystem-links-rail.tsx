import type { ReactNode } from 'react'
import { LinkChip } from '@/components/ui/link-chip'
import { Skeleton } from '@/components/ui/skeleton'
import { ecosystemSites } from '@/data/static/ecosystem'
import { cn } from '@/utils/utils'

/**
 * The route's relative PageLayout is the desktop positioning context. Half the difference between
 * its centred width and the viewport reaches the viewport edge; the final 2rem restores the navbar
 * gutter. The full-height rail lets its contents use the same sticky top as the Photos rail.
 */
const RAIL_CLASS =
  'z-50 mb-6 md:absolute md:inset-y-0 md:left-[calc((100%_-_100vw)/2_+_2rem)] md:mb-0'

function Rail({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(RAIL_CLASS, className)}>{children}</div>
}

/** Route-specific ecosystem shortcuts positioned beneath the navbar initials */
function EcosystemLinksRail() {
  return (
    <Rail>
      <ul
        aria-label="Ecosystem sites"
        className="flex flex-wrap items-center gap-1.5 md:sticky md:top-24 md:flex-col md:items-start"
      >
        {ecosystemSites.map((site) => (
          <li key={site.href}>
            <LinkChip href={site.href} aria-label={`Visit ${site.label}`}>
              {site.label}
            </LinkChip>
          </li>
        ))}
      </ul>
    </Rail>
  )
}

/** Holds the rail's geometry while the Links route is streaming */
function EcosystemLinksRailSkeleton() {
  return (
    <Rail>
      <div className="flex items-center gap-1.5 md:sticky md:top-24 md:flex-col md:items-start">
        {ecosystemSites.map((site) => (
          <Skeleton
            key={site.href}
            tone="muted"
            className="h-4.5 font-mono text-2xs"
            style={{ width: `calc(${site.label.length}ch + 1rem)` }}
          />
        ))}
      </div>
    </Rail>
  )
}

/**
 * Keeps the out-of-flow rail and in-flow page body inside one PageLayout spacing cell. Without this
 * wrapper, PageLayout's sibling margins would offset the rail from its declared position.
 */
export function EcosystemLinksRailLayout({
  children,
  loading = false,
}: {
  children: ReactNode
  loading?: boolean
}) {
  return (
    <div>
      {loading ? <EcosystemLinksRailSkeleton /> : <EcosystemLinksRail />}
      {children}
    </div>
  )
}
