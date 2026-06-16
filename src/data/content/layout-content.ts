import { FULL_NAME } from '@/constants/constants'
import type { CommonContent, FooterContent, NavbarContent } from '@/types/site'
import pkg from '../../../package.json'

export const navbarContent: NavbarContent = {
  home: 'Home',
  blogs: 'Blogs',
  projects: 'Projects',
  photos: 'Photos',
  experiments: 'Experiments',
}

export const footerContent: FooterContent = {
  ownerName: FULL_NAME,
  license: 'CC BY-NC-SA 4.0',
  licenseHref: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  changelogLabel: `v${pkg.version}`,
  changelogHref: '/changelog',
}

export const commonContent: CommonContent = {
  pronounceName: 'Pronounce my name',
  backToTop: 'Back to Top',
}
