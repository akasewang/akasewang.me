import type { NewsletterSectionContent } from '@/types/newsletter'

/** Copy for the homepage signup block */
export const newsletterContent: NewsletterSectionContent = {
  title: 'stay updated.',
  descriptionPrefix: "It's ",
  descriptionHighlight: 'free!',
  descriptionSuffix: ' Get notified instantly whenever a new post drops. Stay updated, stay ahead.',
  emailPlaceholder: 'your@email.com',
  buttonLoading: 'joining',
  buttonSuccess: 'you’re subscribed!',
  buttonDefault: 'join the newsletter',
  errorFallback: 'Unable to subscribe. Please try again later.',
}
