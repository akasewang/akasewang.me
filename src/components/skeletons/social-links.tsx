import { Fragment } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { LinkGroup } from '@/types/site'

/**
 * The measurements the directory and the placeholder standing in for it have to agree on, held here
 * and read by the directory too. A gap changed on one side alone is a page that shifts as it
 * arrives, which is the one thing the placeholder exists to prevent.
 */
export const SOCIAL_LINKS_GRID_CLASS =
  'grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 sm:gap-x-5 sm:gap-y-1.5'

export const SOCIAL_LINKS_ROW_CLASS =
  'flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-2.5 sm:gap-y-1'

/**
 * A link that leads somewhere carries an arrow at rest, not only on hover, so it is wider than its
 * text by the arrow and the margin before it. Counted here, or a row of them would wrap at a
 * different point than the real one and the page would reflow as it arrived.
 */
const ARROW_ALLOWANCE = '1.125rem'

const linkWidth = (label: string, hasHref: boolean) =>
  hasHref ? `calc(${label.length}ch + ${ARROW_ALLOWANCE})` : `${label.length}ch`

/**
 * Holds the shape of SocialLinks while its route streams, for the links directory and the domains
 * one, which both draw that component.
 *
 * The grid and its rows are that component's own classes, and every width is measured in ch against
 * the font the real text will be set in, so the heading column opens at the width it will end up.
 * Each placeholder sits in its own line box rather than standing alone, which is what keeps a
 * heading level with the first row of links beside it instead of centred against however many rows
 * they wrap to.
 */
export function SocialLinksSkeleton({ groups }: { groups: LinkGroup[] }) {
  return (
    <div className={SOCIAL_LINKS_GRID_CLASS}>
      {groups.map((group) => (
        <Fragment key={group.label}>
          <div className="flex h-6 items-center">
            <Skeleton
              tone="muted"
              className="h-3 font-mono text-xs-plus"
              style={{ width: `${group.label.length}ch` }}
            />
          </div>

          <div className={SOCIAL_LINKS_ROW_CLASS}>
            {group.links.map((link) => (
              <span key={link.label} className="mx-0.5 flex h-6 items-center">
                <Skeleton
                  tone="base"
                  className="h-3.5 text-sm"
                  style={{ width: linkWidth(link.label, Boolean(link.href)) }}
                />
              </span>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}
