import { SOCIAL_CATEGORIES } from '@/constants/categories'
import { USERNAME } from '@/constants/constants'
import type { SocialGroup, SocialLink } from '@/types/site'

/** Every profile linked to, each tagged with the kind of place it is */
export const activeSocials: SocialLink[] = [
  {
    href: `https://github.com/${USERNAME}`,
    label: 'GitHub',
    category: 'code',
  },
  {
    href: `https://huggingface.co/${USERNAME}`,
    label: 'Hugging Face',
    category: 'code',
  },
  {
    href: `https://www.figma.com/@${USERNAME}`,
    label: 'Figma',
    category: 'design',
  },
  {
    href: `https://www.behance.net/${USERNAME}`,
    label: 'Behance',
    category: 'design',
  },
  {
    href: `https://rive.app/@${USERNAME}`,
    label: 'Rive',
    category: 'design',
  },
  {
    href: `https://leetcode.com/u/${USERNAME}`,
    label: 'LeetCode',
    category: 'practice',
  },
  {
    href: `https://codeforces.com/profile/${USERNAME}`,
    label: 'Codeforces',
    category: 'practice',
  },
  {
    href: `https://atcoder.jp/users/${USERNAME}`,
    label: 'AtCoder',
    category: 'practice',
  },
  {
    href: `https://www.codechef.com/users/${USERNAME}`,
    label: 'CodeChef',
    category: 'practice',
  },
  {
    href: `https://www.hackerrank.com/profile/${USERNAME}`,
    label: 'HackerRank',
    category: 'practice',
  },
  {
    href: `https://www.kaggle.com/${USERNAME}`,
    label: 'Kaggle',
    category: 'practice',
  },
  {
    href: `https://hackerone.com/${USERNAME}`,
    label: 'HackerOne',
    category: 'security',
  },
  {
    href: `https://bugcrowd.com/h/${USERNAME}`,
    label: 'Bugcrowd',
    category: 'security',
  },
  {
    href: `https://profile.hackthebox.com/profile/019c9a73-81bc-707d-a8e3-c4120f5c4195`,
    label: 'Hack The Box',
    category: 'security',
  },
  {
    href: `https://tryhackme.com/p/${USERNAME}`,
    label: 'TryHackMe',
    category: 'security',
  },
  {
    href: `https://www.linkedin.com/in/${USERNAME}`,
    label: 'LinkedIn',
    category: 'network',
  },
  {
    href: `https://peerlist.io/${USERNAME}`,
    label: 'Peerlist',
    category: 'network',
  },
  {
    href: `https://superteam.fun/earn/t/${USERNAME}`,
    label: 'Superteam',
    category: 'network',
  },
  {
    href: `https://x.com/${USERNAME}`,
    label: 'X [Twitter]',
    category: 'social',
  },
  {
    href: `https://bsky.app/profile/${USERNAME}.me`,
    label: 'Bluesky',
    category: 'social',
  },
  {
    href: `https://mastodon.social/@${USERNAME}`,
    label: 'Mastodon [Social]',
    category: 'social',
  },
  {
    href: `https://www.reddit.com/user/${USERNAME}`,
    label: 'Reddit',
    category: 'social',
  },
  {
    href: `https://news.ycombinator.com/user?id=${USERNAME}`,
    label: 'Hacker News',
    category: 'social',
  },
  {
    href: `https://www.youtube.com/@${USERNAME}`,
    label: 'Youtube',
    category: 'media',
  },
  {
    href: `https://www.instagram.com/${USERNAME}`,
    label: 'Instagram',
    category: 'media',
  },
  {
    href: `https://${USERNAME}.substack.com`,
    label: 'Substack',
    category: 'media',
  },
]

/**
 * Grouped once at module scope, since the list is static. Categories keep the order declared in
 * SOCIAL_CATEGORIES and an empty one drops out, so a group appears the moment its first link does
 * and nothing has to be touched here to add one.
 */
export const socialGroups: SocialGroup[] = SOCIAL_CATEGORIES.flatMap(({ value, label }) => {
  const links = activeSocials.filter((social) => social.category === value)
  return links.length > 0 ? [{ value, label, links }] : []
})
