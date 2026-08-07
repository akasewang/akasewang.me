/** Every string the board renders, kept out of the components so the copy lives in one place */
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
  buttonSendCode: string
  buttonEnterCode: string
  buttonSignIn: string
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

/**
 * One message as the board shows it. The reply is the owner's answer beneath it, absent on a
 * message that has not been answered.
 */
export interface MessageBoardEntry {
  id: number
  name: string
  message: string
  adminReply?: string | null
  createdAt: string | Date
}
