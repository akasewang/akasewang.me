import type { UnsubscribePageContent } from '@/types/newsletter'

/** Copy for the page a reader lands on from the unsubscribe link in an email */
export const unsubscribeContent: UnsubscribePageContent = {
  confirmTitle: 'unsubscribe.',
  confirmDescription:
    'One click and the newsletter stops landing in your inbox. You can resubscribe whenever you change your mind.',
  confirmButton: 'unsubscribe me',
  confirmPending: 'unsubscribing',
  successTitle: 'unsubscribed.',
  successDescription: "You're off the list. No spam and no hard feelings, the door is always open.",
  invalidTitle: 'invalid link.',
  invalidDescription: 'This unsubscribe link is invalid or has already been used.',
  errorTitle: 'something went wrong.',
  errorDescription:
    'Something broke on my end while processing your request. Please try again in a bit.',
  /** Shown by the page and by its loading state alike, so the two cannot say different things */
  footerText: 'Sad to see you go, but I still like you.',
}
