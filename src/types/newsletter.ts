/** Types representing subscriber DB entries, admin panels and email UI. */

/** Copy for the standalone newsletter page header. */
export interface NewsletterPageContent {
  title: string
  subtitle: string
}

/** Copy for the inline newsletter subscription section (heading, form, button states). */
export interface NewsletterSectionContent {
  title: string
  descriptionPrefix: string
  descriptionHighlight: string
  descriptionSuffix: string
  emailPlaceholder: string
  buttonLoading: string
  buttonSuccess: string
  buttonDefault: string
  errorFallback: string
}

/** Copy for the admin newsletter composer panel. */
export interface AdminNewsletterContent {
  title: string
  description: string
  blogSelectPlaceholder: string
  adminPasswordPlaceholder: string
  buttonDefault: string
  buttonLoading: string
  buttonSuccess: string
}

/** Copy for the unsubscribe page across its success, invalid and error states. */
export interface UnsubscribePageContent {
  successTitle: string
  successDescription: string
  invalidTitle: string
  invalidDescription: string
  errorTitle: string
  errorDescription: string
}
