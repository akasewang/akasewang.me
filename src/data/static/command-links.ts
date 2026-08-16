import { GITHUB_URL } from '@/constants/constants'
import { commandContent } from '@/data/content/command-content'
import { type DomainPurpose, domainGroups } from '@/data/static/domains'
import { ecosystemSites } from '@/data/static/ecosystem'
import { socialGroups } from '@/data/static/social'
import type { CommandGroup, CommandIconName, CommandItem } from '@/types/command'

/** The site's own pages, listed in the menu in the order they are drawn here */
export const commandPages: CommandItem[] = [
  {
    id: 'page-home',
    kind: 'link',
    label: 'Home',
    icon: 'home',
    keywords: ['about', 'index', 'start', 'bio'],
    href: '/',
  },
  {
    id: 'page-blogs',
    kind: 'link',
    label: 'Blogs',
    icon: 'blogs',
    keywords: ['writing', 'posts', 'articles', 'essays', 'notes'],
    href: '/blogs',
  },
  {
    id: 'page-projects',
    kind: 'link',
    label: 'Projects',
    icon: 'projects',
    keywords: ['work', 'builds', 'case studies'],
    href: '/projects',
  },
  {
    id: 'page-photos',
    kind: 'link',
    label: 'Photos',
    icon: 'photos',
    keywords: ['gallery', 'pictures', 'captured', 'generated'],
    href: '/photos',
  },
  {
    id: 'page-skills',
    kind: 'link',
    label: 'Skills',
    icon: 'skills',
    keywords: ['stack', 'tools', 'tech', 'languages'],
    href: '/skills',
  },
  {
    id: 'page-links',
    kind: 'link',
    label: 'Links',
    icon: 'link',
    keywords: ['socials', 'profiles', 'elsewhere', 'find me'],
    href: '/links',
  },
  {
    id: 'page-domains',
    kind: 'link',
    label: 'Registered Domains',
    icon: 'globe',
    keywords: ['dns', 'registered', 'owned', 'urls', 'parked'],
    href: '/domains',
  },
  {
    id: 'page-catalog',
    kind: 'link',
    label: 'Catalog',
    icon: 'catalog',
    keywords: ['anime', 'manga', 'books', 'novels', 'games', 'reading', 'watching'],
    href: '/catalog',
  },
  {
    id: 'page-message-board',
    kind: 'link',
    label: 'Message Board',
    icon: 'messageBoard',
    keywords: ['guestbook', 'chat', 'say hi', 'comments'],
    href: '/message-board',
  },
  {
    id: 'page-newsletter',
    kind: 'link',
    label: 'Newsletter',
    icon: 'newsletter',
    keywords: ['subscribe', 'email', 'updates'],
    href: '/#newsletter',
  },
  {
    id: 'page-changelog',
    kind: 'link',
    label: 'Changelog',
    icon: 'changelog',
    keywords: ['releases', 'history', 'versions', 'updates'],
    href: '/changelog',
  },
]

/**
 * My other sites, built from the same list the links page reads.
 *
 * Sharing the source is what keeps the two from drifting: a site added there appears here without
 * anything being touched, and the description a reader sees on the links page is the same line the
 * menu shows under the name. The icon is chosen per site, since there are few enough to say what
 * each one is rather than marking them all as links out.
 */
const ECOSYSTEM_ICONS: Record<string, CommandIconName> = {
  Studio: 'cow',
  Components: 'blueprint',
  Design: 'aperture',
}

/** The other sites, built from the same list the links page renders so the two cannot diverge */
export const commandEcosystem: CommandItem[] = ecosystemSites.map(
  (site): CommandItem => ({
    id: `ecosystem-${site.label.toLowerCase()}`,
    kind: 'link',
    label: site.label,
    icon: ECOSYSTEM_ICONS[site.label] ?? 'link',
    meta: site.domain,
    excerpt: site.description,
    keywords: ['ecosystem', 'mine', 'own', 'site', site.domain],
    href: site.href,
    external: true,
  }),
)

/** One icon per purpose, which its domains take unless a row names its own */
const DOMAIN_ICONS: Record<DomainPurpose, CommandIconName> = {
  portfolio: 'circlesFour',
  studio: 'cow',
  projects: 'cube',
}

/**
 * The domains, one child group per purpose under the Domains section, like the social groups.
 * A held domain has nowhere of its own to go, so it leads to the page that lists it.
 */
export const commandDomainGroups: CommandGroup[] = domainGroups.map((group) => ({
  id: `domain-${group.label}`,
  parentGroupId: 'domains',
  label: group.label,
  icon: DOMAIN_ICONS[group.label],
  items: group.links.map(
    (link): CommandItem => ({
      id: `domain-${link.label}`,
      kind: 'link',
      label: link.label,
      /** Only where it says something the heading above the row does not */
      meta: link.href ? undefined : 'held',
      keywords: ['domain', 'dns', 'registered', 'owned'],
      href: link.href ?? '/domains',
      external: Boolean(link.href),
    }),
  ),
}))

const CATEGORY_ICONS: Record<string, CommandIconName> = {
  code: 'terminalWindow',
  design: 'aperture',
  practice: 'target',
  security: 'shieldCheck',
  ecosystem: 'usersThree',
  social: 'at',
  media: 'monitorPlay',
}

/** Links that leave the site: the source and the feed */
export const commandElsewhere: CommandItem[] = [
  {
    id: 'link-source',
    kind: 'link',
    label: 'Source code',
    icon: 'github',
    meta: 'github',
    keywords: ['repository', 'repo', 'code'],
    href: GITHUB_URL,
    external: true,
  },
  {
    id: 'link-rss',
    kind: 'link',
    label: 'RSS feed',
    icon: 'rss',
    meta: 'feed',
    keywords: ['subscribe', 'atom', 'syndication'],
    href: '/feed.xml',
    external: true,
  },
]

/** Each social category as its own group under the elsewhere section, not one long list */
export const commandSocialGroups: CommandGroup[] = socialGroups.map(({ label, value, links }) => {
  /** The ecosystem's social profiles use the distinct Connections label inside that section */
  const contentKey = value === 'ecosystem' ? 'connections' : value
  return {
    id: `social-${value}`,
    parentGroupId: 'elsewhere',
    label: commandContent.groups[contentKey as keyof typeof commandContent.groups] ?? label,
    items: links.map(
      (link): CommandItem => ({
        id: `link-${link.label.toLowerCase().replace(/\s+/g, '-')}`,
        kind: 'link',
        label: link.label,
        icon: CATEGORY_ICONS[value] ?? 'link',
        meta: label,
        keywords: ['social', 'profile', label],
        href: link.href,
        external: true,
      }),
    ),
  }
})
