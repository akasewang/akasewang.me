import type { ToastMessages } from '@/types/site'

export const toastContent: ToastMessages = {
  newsletter: {
    success: 'All clear! Newsletter broadcast sent successfully.',
    error: 'Houston, we have a problem. Newsletter broadcast failed.',
    broadcastSuccess: (count: number) => `Success! Broadcast sent to ${count} subscribers.`,
    passwordRequired: 'Admin password is required',
    unexpectedError: 'An unexpected error occurred',
    unauthorized: 'Unauthorized: Incorrect admin password',
    postNotFound: 'Information missing: No blog post selected.',
    noSubscribers: 'Growth needed: You have no newsletter subscribers yet.',
    broadcastError: 'Transmission failed: Could not broadcast to subscribers.',
  },
  messageBoard: {
    success: 'Message posted successfully!',
    error: 'Failed to post message. Please try again.',
    adminLogin: 'Admin mode activated',
    adminLogout: 'Admin mode deactivated',
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
