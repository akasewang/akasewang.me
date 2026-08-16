import { HERO_ROW_CLASS } from '@/components/skeletons/shared'
import { LinkChip } from '@/components/ui/link-chip'
import { LinkText } from '@/components/ui/link-text'
import type { SocialLink } from '@/types/site'

interface FeaturedSocialLinksProps {
  links: SocialLink[]
  totalCount: number
}

/**
 * The picked few profiles, with however many are left over standing as one chip through to the rest.
 *
 * Which few is decided by the caller, not here: this is handed a list and a total and draws the
 * difference between them. Named for the picking rather than for previewing anything, since nothing
 * here shows what sits at the far end of a link, only which links there are.
 */
export function FeaturedSocialLinks({ links, totalCount }: FeaturedSocialLinksProps) {
  const remainingCount = Math.max(totalCount - links.length, 0)

  return (
    <ul className={HERO_ROW_CLASS}>
      {links.map((link) => (
        <li key={link.label} className="inline-flex h-6 items-center">
          <LinkText href={link.href}>{link.label}</LinkText>
        </li>
      ))}

      {remainingCount > 0 && (
        <li className="inline-flex h-6 items-center">
          <LinkChip href="/links" aria-label={`View ${remainingCount} more links`}>
            {remainingCount} more
          </LinkChip>
        </li>
      )}
    </ul>
  )
}
