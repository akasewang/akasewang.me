import { Fragment } from 'react'
import { LinkText } from '@/components/ui/link-text'
import type { SocialGroup } from '@/types/site'

interface SocialLinksProps {
  groups: SocialGroup[]
}

export function SocialLinks({ groups }: SocialLinksProps) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 sm:gap-x-5 sm:gap-y-1.5">
      {groups.map((group) => (
        <Fragment key={group.value}>
          <dt className="font-mono text-[13px] leading-6 text-muted-foreground">{group.label}</dt>
          <dd className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-2.5 sm:gap-y-1">
            {group.links.map((link) => (
              <LinkText key={link.label} href={link.href}>
                {link.label}
              </LinkText>
            ))}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}
