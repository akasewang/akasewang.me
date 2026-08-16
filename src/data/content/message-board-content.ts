import type { MessageBoardContent } from '@/types/message-board'

/** Every string the message board renders, including the owner's controls */
export const messageBoardContent: MessageBoardContent = {
  title: 'message board.',
  subtitle: 'Your message is safe with me (and the entire internet).',
  formPlaceholder: 'Leave a message...',
  namePlaceholder: 'Your name',
  recentMessagesLabel: 'recent messages.',
  noMessagesLabel: 'No messages yet. Be the first to leave a message!',
  buttonLoading: 'posting',
  buttonSuccess: 'message posted!',
  buttonDefault: 'post a message',
  buttonSendCode: 'email me a code',
  buttonEnterCode: 'enter verification code',
  buttonSignIn: 'sign in',
  loadingMore: 'Loading more...',
  loadMore: 'load more',
  endOfMessages: 'No more messages.',
  offline: 'Database offline. Cannot load messages right now.',
  connectionLost: "Connection lost. Couldn't load more messages.",
  retry: 'Retry',
  post: {
    title: 'responses.',
    empty: 'Nothing here yet. Yours would be the first.',
    countLabel: (total) => `${total} ${total === 1 ? 'response' : 'responses'}`,
  },
  admin: {
    delete: 'Delete',
    reply: 'Reply',
    editReply: 'Edit Reply',
    textareaPlaceholder: 'Write your reply...',
    cancel: 'Cancel',
    sending: 'Sending...',
    send: 'Send',
  },
  /** The closing line under the page, shown by the page and by its loading state alike */
  footerText: 'Parting is such sweet sorrow... unless you leave a message first.',
}
