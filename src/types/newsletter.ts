/** Types representing subscriber DB entries, admin panels and email UI. */

/** Copy for the standalone newsletter page header. */
export interface NewsletterPageContent {
  /** Page heading. */
  title: string
  /** Page subheading. */
  subtitle: string
}

/** Copy for the inline newsletter subscription section (heading, form, button states). */
export interface NewsletterSectionContent {
  /** Section heading. */
  title: string
  /** Text before the highlighted phrase in the description. */
  descriptionPrefix: string
  /** Highlighted phrase in the description. */
  descriptionHighlight: string
  /** Text after the highlighted phrase in the description. */
  descriptionSuffix: string
  /** Placeholder for the email input. */
  emailPlaceholder: string
  /** Subscribe button text while submitting. */
  buttonLoading: string
  /** Subscribe button text after success. */
  buttonSuccess: string
  /** Default subscribe button text. */
  buttonDefault: string
  /** Fallback message shown on an unexpected error. */
  errorFallback: string
}

/** Copy for the admin newsletter composer panel. */
export interface AdminNewsletterContent {
  /** Panel heading. */
  title: string
  /** Panel description. */
  description: string
  /** Placeholder for the blog selector. */
  blogSelectPlaceholder: string
  /** Placeholder for the admin password input. */
  adminPasswordPlaceholder: string
  /** Default send button text. */
  buttonDefault: string
  /** Send button text while broadcasting. */
  buttonLoading: string
  /** Send button text after success. */
  buttonSuccess: string
}

/** Copy for the unsubscribe page across its success, invalid and error states. */
export interface UnsubscribePageContent {
  /** Heading shown after a successful unsubscribe. */
  successTitle: string
  /** Description shown after a successful unsubscribe. */
  successDescription: string
  /** Heading shown for an invalid unsubscribe link. */
  invalidTitle: string
  /** Description shown for an invalid unsubscribe link. */
  invalidDescription: string
  /** Heading shown when unsubscribing errors out. */
  errorTitle: string
  /** Description shown when unsubscribing errors out. */
  errorDescription: string
}
