/** Types for the guestbook feature, including DB entries and UI content. */

/** Static copy for the message board UI, including admin only action labels. */
export interface MessageBoardContent {
  title: string
  subtitle: string
  formPlaceholder: string
  namePlaceholder: string
  recentMessagesLabel: string
  noMessagesLabel: string
  buttonLoading: string
  buttonSuccess: string
  buttonDefault: string
  loadingMore: string
  endOfMessages: string
  offline: string
  connectionLost: string
  retry: string
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

/** A single message board entry as stored/returned by the database. */
export interface MessageBoardEntry {
  id: number
  name: string
  message: string
  adminReply?: string | null
  createdAt: string | Date
}
