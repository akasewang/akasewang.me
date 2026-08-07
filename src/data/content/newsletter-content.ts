import type { NewsletterPageContent, NewsletterSectionContent } from '@/types/newsletter'

/** Copy for the public newsletter page */
export const newsletterPageContent: NewsletterPageContent = {
  title: 'newsletter.',
  subtitle: 'Fresh code, hot takes and zero spam. Pinky promise.',
}

/** Copy for the signup block that appears at the end of a post */
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
