import type { BlogsListingContent } from '@/types/blog'

/** Copy for the blogs listing, including what each empty filter says */
export const blogsListingContent: BlogsListingContent = {
  title: 'blogs.',
  subtitle: 'More thoughts than I know what to do with.',
  noTechnical: 'No technical articles published yet.',
  noPersonal: 'No personal blogs published yet.',
  /** The closing line under the page, shown by the page and by its loading state alike */
  footerText: "If you've made it this far, you deserve a coffee. Or a nap.",
}
