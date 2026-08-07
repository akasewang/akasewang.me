import type { AdminNewsletterContent } from '@/types/newsletter'

/** Copy for the owner's page for writing and sending a newsletter issue */
export const adminNewsletterContent: AdminNewsletterContent = {
  title: 'broadcast newsletter.',
  description: 'Send a new broadcast to all your subscribers.',
  blogSelectPlaceholder: 'Which article are we sharing?',
  adminEmailPlaceholder: 'Your admin email',
  adminCodePlaceholder: 'Enter verification code',
  enterEmailDefault: 'Enter your admin email',
  enterCodeDefault: 'Enter verification code',
  sendCodeDefault: 'Email me a code',
  sendCodeLoading: 'Sending...',
  buttonDefault: 'Broadcast Transmission',
  buttonLoading: 'Transmitting...',
  buttonSuccess: 'Broadcast Sent!',
}
