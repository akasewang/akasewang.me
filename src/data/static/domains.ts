import { SITE, SITE_URL } from '@/constants/constants'
import type { LinkGroup } from '@/types/site'

/**
 * What a domain can be held for. The command menu keys its icons by these, so a purpose added or
 * renamed here fails to typecheck there until its icon follows.
 */
export type DomainPurpose = 'portfolio' | 'studio' | 'projects'

/**
 * Every domain registered under this name, grouped by what each one is for.
 *
 * Registrations only: a subdomain belongs to the entry it sits under, which is why the ecosystem
 * list can name a site this one does not. An entry with no href is held but not standing anything
 * up, and is drawn as plain text rather than linked to a parking page.
 */
export const domainGroups: Array<LinkGroup & { label: DomainPurpose }> = [
  {
    label: 'portfolio',
    links: [
      { label: SITE, href: SITE_URL },
      { label: 'akasewang.com', href: 'https://www.akasewang.com' },
      { label: 'akashdewangan.com', href: 'https://www.akashdewangan.com' },
    ],
  },
  {
    label: 'studio',
    links: [{ label: 'manakin.studio', href: 'https://www.manakin.studio' }],
  },
  {
    label: 'projects',
    links: [
      { label: 'noddy.studio', href: 'https://www.noddy.studio' },
      { label: 'paproo.com', href: 'https://www.paproo.com' },
    ],
  },
]
