/** Types for the guestbook feature, including DB entries and UI content. */

/** Static copy for the message board UI, including admin only action labels. */
export interface MessageBoardContent {
  /** Page heading. */
  title: string
  /** Page subheading. */
  subtitle: string
  /** Placeholder for the message input. */
  formPlaceholder: string
  /** Placeholder for the name input. */
  namePlaceholder: string
  /** Label above the recent messages list. */
  recentMessagesLabel: string
  /** Label shown when there are no messages yet. */
  noMessagesLabel: string
  /** Submit button text while sending. */
  buttonLoading: string
  /** Submit button text after a successful post. */
  buttonSuccess: string
  /** Default submit button text. */
  buttonDefault: string
  /** Label shown while loading older messages. */
  loadingMore: string
  /** Label shown when every message has loaded. */
  endOfMessages: string
  /** Label shown when the visitor is offline. */
  offline: string
  /** Label shown when the connection drops. */
  connectionLost: string
  /** Retry action label. */
  retry: string
  /** Admin only action labels, shown once authenticated. */
  admin: {
    /** Delete a message. */
    delete: string
    /** Start a reply. */
    reply: string
    /** Edit an existing reply. */
    editReply: string
    /** Placeholder for the reply textarea. */
    textareaPlaceholder: string
    /** Cancel the reply. */
    cancel: string
    /** Reply button text while sending. */
    sending: string
    /** Reply submit button text. */
    send: string
  }
}

/** A single message board entry as stored/returned by the database. */
export interface MessageBoardEntry {
  /** Auto incrementing primary key. */
  id: number
  /** Display name of the sender. */
  name: string
  /** The message body. */
  message: string
  /** Optional admin reply, null when none. */
  adminReply?: string | null
  /** Creation timestamp from the database. */
  createdAt: string | Date
}
