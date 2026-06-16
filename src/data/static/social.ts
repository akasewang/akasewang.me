import { USERNAME } from '@/constants/constants'
import type { SocialLink } from '@/types/site'

export const activeSocials: SocialLink[] = [
  {
    href: `https://github.com/${USERNAME}`,
    label: 'GitHub',
    display: `@${USERNAME}`,
  },
  {
    href: `https://linkedin.com/in/${USERNAME}`,
    label: 'LinkedIn',
    display: `@${USERNAME}`,
  },
  {
    href: `https://peerlist.io/${USERNAME}`,
    label: 'Peerlist',
    display: `@${USERNAME}`,
  },
  {
    href: `https://www.youtube.com/@${USERNAME}`,
    label: 'Youtube',
    display: `@${USERNAME}`,
  },
  {
    href: `https://x.com/${USERNAME}`,
    label: 'X [Twitter]',
    display: `@${USERNAME}`,
  },
  {
    href: `https://www.instagram.com/${USERNAME}`,
    label: 'Instagram',
    display: `@${USERNAME}`,
  },
  {
    href: `https://bsky.app/profile/${USERNAME}.me`,
    label: 'Bluesky',
    display: `@${USERNAME}.me`,
  },
  {
    href: `https://www.reddit.com/user/${USERNAME}`,
    label: 'Reddit',
    display: `@${USERNAME}`,
  },
  {
    href: `https://mastodon.social/@${USERNAME}`,
    label: 'Mastodon [Social]',
    display: `@${USERNAME}`,
  },
]

export const inactiveSocials: SocialLink[] = []
