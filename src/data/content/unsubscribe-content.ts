import type { UnsubscribePageContent } from '@/types/newsletter'

/**
 * Unsubscribe Content Data Dictionary.
 * Centralized static configuration and text definitions.
 */
export const unsubscribeContent: UnsubscribePageContent = {
  successTitle: 'Unsubscribed Successfully',
  successDescription: "You've been removed from our list. We're sorry to see you go!",
  invalidTitle: 'Invalid Link',
  invalidDescription: 'This unsubscribe link is invalid or has already been used.',
  errorTitle: 'Something Went Wrong',
  errorDescription: 'An error occurred while processing your request. Please try again later.',
}
