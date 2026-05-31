import type { AdminNewsletterContent } from '@/types/newsletter'

/**
 * Admin Newsletter Content Data Dictionary.
 * Centralized static configuration and text definitions.
 */
export const adminNewsletterContent: AdminNewsletterContent = {
  title: 'broadcast newsletter.',
  description: 'Send a new broadcast to all your subscribers.',
  blogSelectPlaceholder: 'Which article are we sharing?',
  adminPasswordPlaceholder: 'Enter your password',
  buttonDefault: 'Broadcast Transmission',
  buttonLoading: 'Transmitting...',
  buttonSuccess: 'Broadcast Sent!',
}
