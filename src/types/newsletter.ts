/** Types representing subscriber DB entries, admin panels, and email UI */
export interface NewsletterPageContent {
  title: string
  subtitle: string
}

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

export interface AdminNewsletterContent {
  title: string
  description: string
  blogSelectPlaceholder: string
  adminPasswordPlaceholder: string
  buttonDefault: string
  buttonLoading: string
  buttonSuccess: string
}

export interface UnsubscribePageContent {
  successTitle: string
  successDescription: string
  invalidTitle: string
  invalidDescription: string
  errorTitle: string
  errorDescription: string
}
