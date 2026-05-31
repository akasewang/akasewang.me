import { FULL_NAME } from '@/constants/constants'
import type { NavbarContent, FooterContent, CommonContent } from '@/types/site'

/**
 * Navbar Content Data Dictionary.
 * Centralized static configuration and text definitions.
 */
export const navbarContent: NavbarContent = {
  home: 'Home',
  blogs: 'Blogs',
  projects: 'Projects',
  components: 'Components',
  photos: 'Photos',
}

export const footerContent: FooterContent = {
  ownerName: FULL_NAME,
  license: 'CC BY-NC-SA 4.0',
  licenseHref: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}

export const commonContent: CommonContent = {
  pronounceName: 'Pronounce my name',
  backToTop: 'Back to Top',
}
