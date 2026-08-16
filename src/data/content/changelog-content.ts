import type { PageContent } from '@/types/site'

/** Copy for the changelog page */
export const changelogPageContent: PageContent = {
  title: 'changelog.',
  subtitle: 'Release notes for this site, pulled straight from the commit history.',
  /** The closing line under the page, shown by the page and by its loading state alike */
  footerText: "That's everything shipped so far. This page writes itself, one commit at a time.",
}
