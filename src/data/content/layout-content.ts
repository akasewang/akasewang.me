import { FULL_NAME } from '@/constants/constants'
import pkg from '../../../package.json'
import type {
  NavbarContent,
  FooterContent,
  CommonContent,
  AnnouncementBannerContent,
} from '@/types/site'

/**
 * Global layout copy: navigation labels, footer attribution and shared UI strings
 * used across the navbar, footer and common page chrome.
 */

/** Primary navigation link labels. */
export const navbarContent: NavbarContent = {
  home: 'Home',
  blogs: 'Blogs',
  projects: 'Projects',
  photos: 'Photos',
  experiments: 'Experiments',
  changelog: 'Changelog',
  catalog: 'Catalog',
}

/** Footer attribution and content license. */
export const footerContent: FooterContent = {
  ownerName: FULL_NAME,
  license: 'CC BY-NC-SA 4.0',
  licenseHref: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  changelogLabel: `v${pkg.version}`,
  changelogHref: '/changelog',
}

/** Shared chrome labels reused across pages (name pronunciation, back to top). */
export const commonContent: CommonContent = {
  pronounceName: 'Pronounce my name',
  backToTop: 'Back to Top',
}

/**
 * Top announcement banner content.
 */
export const announcementBanner: AnnouncementBannerContent = {
  message: 'Building something? Click here if you want seamless design and development',
  href: 'https://noddy.studio/',
  dismissLabel: 'Dismiss banner',
}
