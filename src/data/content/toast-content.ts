import type { ToastMessages } from '@/types/site'

/** Every toast the site can raise, grouped by what raises it */
export const toastContent: ToastMessages = {
  newsletter: {
    broadcastSuccess: (count: number) => `Broadcast sent to ${count} subscribers`,
    otpSent: 'Verification code sent to your inbox',
    otpUnavailable: 'Admin recipient email not configured',
    otpSenderUnavailable: 'Sender email not configured',
    otpEmailRequired: 'Admin email is required',
    otpEmailInvalid: 'Invalid admin email address',
    otpSendFailed: 'Failed to send verification code',
    unexpectedError: 'An unexpected error occurred',
    unauthorized: 'Invalid or expired verification code',
    postNotFound: 'No blog post selected',
    noSubscribers: 'No newsletter subscribers yet',
    broadcastError: 'Failed to broadcast newsletter',
    partialBroadcast: (sent: number, total: number) =>
      `Broadcast sent to ${sent} of ${total} subscribers before failing`,
  },
  messageBoard: {
    success: 'Message posted successfully',
    adminLogin: 'Admin mode activated',
    connectionError: 'Network connection error',
    botDetected: 'Verification failed',
    invalidName: 'Please enter a valid name',
    invalidMessage: 'Please enter a message',
    messageTooLong: 'Message exceeds 500 characters',
    rateLimit: 'Please wait before posting again',
    genericError: 'Something went wrong. Please try again',
    deleteError: 'Failed to delete message',
    replyError: 'Failed to send reply',
  },
  subscribe: {
    successNew: 'Subscribed! Please check your email',
    successReturning: 'Welcome back! Resubscribed successfully',
    invalidEmail: 'Please enter a valid email address',
    alreadySubscribed: 'This email is already subscribed',
    internalError: 'Could not process subscription',
    wait: 'Please wait before trying again',
  },
}
