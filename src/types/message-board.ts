/** Every string the board renders, kept out of the components so the copy lives in one place */
export interface MessageBoardContent {
  /** The closing line under the page */
  footerText: string
  title: string
  subtitle: string
  formPlaceholder: string
  namePlaceholder: string
  recentMessagesLabel: string
  noMessagesLabel: string
  buttonLoading: string
  buttonSuccess: string
  buttonDefault: string
  buttonSendCode: string
  buttonEnterCode: string
  buttonSignIn: string
  loadingMore: string
  /** Asked for by hand where the board sits inside a page rather than filling one */
  loadMore: string
  endOfMessages: string
  offline: string
  connectionLost: string
  retry: string
  /** The board that sits under a blog post or a project, which words itself more quietly */
  post: {
    title: string
    empty: string
    countLabel: (total: number) => string
  }
  admin: {
    delete: string
    reply: string
    editReply: string
    textareaPlaceholder: string
    cancel: string
    sending: string
    send: string
  }
}

/**
 * One message as the board shows it. The reply is the owner's answer beneath it, absent on a
 * message that has not been answered, and carrying its own time where one was recorded.
 */
export interface MessageBoardEntry {
  id: number
  name: string
  message: string
  adminReply?: string | null
  adminReplyAt?: string | Date | null
  createdAt: string | Date
}
