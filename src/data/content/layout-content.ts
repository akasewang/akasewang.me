import { FULL_NAME } from '@/constants/constants'
import type { NavbarContent, FooterContent, CommonContent } from '@/types/site'

/**
 * Global layout copy: navigation labels, footer attribution, and shared UI strings
 * used across the navbar, footer, and common page chrome.
 */

/** Primary navigation link labels. */
export const navbarContent: NavbarContent = {
  home: 'Home',
  blogs: 'Blogs',
  projects: 'Projects',
  components: 'Components',
  photos: 'Photos',
}

/** Footer attribution and content license. */
export const footerContent: FooterContent = {
  ownerName: FULL_NAME,
  license: 'CC BY-NC-SA 4.0',
  licenseHref: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}

/** Shared chrome labels reused across pages (name pronunciation, back-to-top). */
export const commonContent: CommonContent = {
  pronounceName: 'Pronounce my name',
  backToTop: 'Back to Top',
}
