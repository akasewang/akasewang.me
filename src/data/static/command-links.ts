import { SITE, USERNAME } from '@/constants/constants'
import { socialGroups } from '@/data/static/social'
import type { CommandItem } from '@/types/command'

/** The site's own pages, listed in the menu in the order they are drawn here */
export const commandPages: CommandItem[] = [
  {
    id: 'page-home',
    label: 'Home',
    icon: 'home',
    keywords: ['about', 'index', 'start', 'bio'],
    href: '/',
  },
  {
    id: 'page-blogs',
    label: 'Blogs',
    icon: 'blogs',
    keywords: ['writing', 'posts', 'articles', 'essays', 'notes'],
    href: '/blogs',
  },
  {
    id: 'page-projects',
    label: 'Projects',
    icon: 'projects',
    keywords: ['work', 'builds', 'case studies'],
    href: '/projects',
  },
  {
    id: 'page-photos',
    label: 'Photos',
    icon: 'photos',
    keywords: ['gallery', 'pictures', 'captured', 'generated'],
    href: '/photos',
  },
  {
    id: 'page-skills',
    label: 'Skills',
    icon: 'skills',
    keywords: ['stack', 'tools', 'tech', 'languages'],
    href: '/skills',
  },
  {
    id: 'page-catalog',
    label: 'Catalog',
    icon: 'catalog',
    keywords: ['anime', 'manga', 'books', 'novels', 'games', 'reading', 'watching'],
    href: '/catalog',
  },
  {
    id: 'page-message-board',
    label: 'Message Board',
    icon: 'messageBoard',
    keywords: ['guestbook', 'chat', 'say hi', 'comments'],
    href: '/message-board',
  },
  {
    id: 'page-newsletter',
    label: 'Newsletter',
    icon: 'newsletter',
    keywords: ['subscribe', 'email', 'updates'],
    href: '/newsletter',
  },
  {
    id: 'page-changelog',
    label: 'Changelog',
    icon: 'changelog',
    keywords: ['releases', 'history', 'versions', 'updates'],
    href: '/changelog',
  },
]

/** Links that leave the site: the source, the feed and every social profile */
export const commandElsewhere: CommandItem[] = [
  {
    id: 'link-source',
    label: 'Source code',
    icon: 'github',
    meta: 'github',
    keywords: ['repository', 'repo', 'code'],
    href: `https://github.com/${USERNAME}/${SITE}`,
    external: true,
  },
  {
    id: 'link-rss',
    label: 'RSS feed',
    icon: 'rss',
    meta: 'feed',
    keywords: ['subscribe', 'atom', 'syndication'],
    href: '/feed.xml',
    external: true,
  },
  ...socialGroups.flatMap(({ label, links }) =>
    links.map(
      (link): CommandItem => ({
        id: `link-${link.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: link.label,
        icon: 'link',
        meta: label,
        keywords: ['social', 'profile', label],
        href: link.href,
        external: true,
      }),
    ),
  ),
]
