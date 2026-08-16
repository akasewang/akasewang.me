import { Fragment } from 'react'
import {
  SOCIAL_LINKS_GRID_CLASS,
  SOCIAL_LINKS_ROW_CLASS,
} from '@/components/skeletons/social-links'
import { LinkText } from '@/components/ui/link-text'
import type { LinkGroup } from '@/types/site'

interface SocialLinksProps {
  groups: LinkGroup[]
}

/**
 * The directory of links, each run under the heading it belongs to.
 *
 * One grid holds every row so the headings share a column and the links start on the same line
 * whatever the heading beside them says. Splitting a run into a list of its own would let its
 * heading column size itself and pull the whole thing out of true, which is why groups that are not
 * profiles are passed in here rather than drawn separately.
 */
export function SocialLinks({ groups }: SocialLinksProps) {
  return (
    <dl className={SOCIAL_LINKS_GRID_CLASS}>
      {groups.map((group) => (
        <Fragment key={group.label}>
          <dt className="font-mono text-xs-plus leading-6 text-muted-foreground">{group.label}</dt>
          <dd className={SOCIAL_LINKS_ROW_CLASS}>
            {/**
             * An entry with nowhere to go still goes through LinkText, which draws it as one of
             * these minus the anchor. Selecting on click gives it back the one thing worth doing
             * with a domain that leads nowhere, which is copying it.
             */}
            {group.links.map((link) => (
              <LinkText
                key={link.label}
                href={link.href}
                className={link.href ? undefined : 'select-all'}
              >
                {link.label}
              </LinkText>
            ))}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}
