/** Copy for the public newsletter page */
export interface NewsletterPageContent {
  title: string
  subtitle: string
}

/** Copy for the signup block that appears at the end of a post */
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

/** Copy for the owner's page for writing and sending an issue */
export interface AdminNewsletterContent {
  title: string
  description: string
  blogSelectPlaceholder: string
  adminEmailPlaceholder: string
  adminCodePlaceholder: string
  enterEmailDefault: string
  enterCodeDefault: string
  sendCodeDefault: string
  sendCodeLoading: string
  buttonDefault: string
  buttonLoading: string
  buttonSuccess: string
}

/** Copy for the page a reader lands on from the unsubscribe link in an email */
export interface UnsubscribePageContent {
  confirmTitle: string
  confirmDescription: string
  confirmButton: string
  confirmPending: string
  successTitle: string
  successDescription: string
  invalidTitle: string
  invalidDescription: string
  errorTitle: string
  errorDescription: string
}
