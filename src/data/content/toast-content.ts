import type { ToastMessages } from '@/types/site'

export const toastContent: ToastMessages = {
  newsletter: {
    broadcastSuccess: (count: number) => `Success! Broadcast sent to ${count} subscribers.`,
    otpSent: 'If that is the admin address, a code is in the inbox. It lasts 10 minutes.',
    otpUnavailable: 'No admin address is configured to send a code to.',
    otpEmailRequired: 'Admin email is required',
    unexpectedError: 'An unexpected error occurred',
    unauthorized: 'Unauthorized: that code is wrong, expired or used up',
    postNotFound: 'Information missing: No blog post selected.',
    noSubscribers: 'Growth needed: You have no newsletter subscribers yet.',
    broadcastError: 'Transmission failed: Could not broadcast to subscribers.',
    partialBroadcast: (sent: number, total: number) =>
      `Transmission stopped: reached ${sent} of ${total} subscribers before failing.`,
  },
  messageBoard: {
    success: 'Message posted successfully!',
    adminLogin: 'Admin mode activated',
    connectionError: 'Network issue: Please check your connection.',
    botDetected: 'Bot detected: Verification failed.',
    invalidName: 'Please enter a valid name.',
    invalidMessage: 'Please enter a message.',
    messageTooLong: 'Message is too long (max 500 characters).',
    rateLimit: 'System cooling: Please wait before posting again.',
    genericError: 'Something went wrong. Please try again.',
    deleteError: 'Failed to delete message.',
    replyError: 'Failed to send reply.',
  },
  subscribe: {
    successNew: 'Welcome aboard! Please check your email.',
    successReturning: 'Welcome back! It is great to have you again.',
    invalidEmail: 'Valid email required: Please check your address.',
    alreadySubscribed: 'Already on the list: This email is already subscribed!',
    internalError: 'System error: Could not process subscription.',
    wait: 'Cooling down: Please wait for the timer to finish.',
  },
}
