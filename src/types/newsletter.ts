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
