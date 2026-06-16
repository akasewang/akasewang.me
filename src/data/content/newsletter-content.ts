import type { NewsletterPageContent, NewsletterSectionContent } from '@/types/newsletter'

export const newsletterPageContent: NewsletterPageContent = {
  title: 'newsletter.',
  subtitle: 'Fresh code, hot takes and zero spam. Pinky promise.',
}

export const newsletterContent: NewsletterSectionContent = {
  title: 'stay updated.',
  descriptionPrefix: "It's ",
  descriptionHighlight: 'free!',
  descriptionSuffix: ' Get notified instantly whenever a new post drops. Stay updated, stay ahead.',
  emailPlaceholder: 'your@email.com',
  buttonLoading: 'subscribing',
  buttonSuccess: 'subscribed!',
  buttonDefault: 'subscribe',
  errorFallback: 'Unable to subscribe. Please try again later.',
}
