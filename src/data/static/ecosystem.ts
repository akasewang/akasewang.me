import type { EcosystemSite } from '@/types/site'

/**
 * The sites in this project's wider ecosystem.
 *
 * Each stands on its own rather than documenting this one, so the copy says what a reader will find
 * there instead of describing this site's insides. Kept apart from the profiles because they are not
 * accounts anywhere: they are places the work lives, and a reader arriving at one expects the thing
 * itself rather than a page about me. The domain is carried separately from the href so a listing
 * can show where a link goes without parsing it back out of the URL.
 */
export const ecosystemSites: EcosystemSite[] = [
  {
    href: 'https://www.manakin.studio',
    label: 'Studio',
    domain: 'manakin.studio',
    description: 'A design and development studio of one, taking products from idea to production.',
  },
  {
    href: 'https://ui.manakin.studio',
    label: 'Components',
    domain: 'ui.manakin.studio',
    description: 'Interface pieces built to be reused, each one live and there to be taken.',
  },
  {
    href: 'https://design.akasewang.me',
    label: 'Design',
    domain: 'design.akasewang.me',
    description: 'Interfaces drawn before they were built, and a few that never were.',
  },
]
