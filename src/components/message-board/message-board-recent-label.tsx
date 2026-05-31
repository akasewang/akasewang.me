import { messageBoardContent } from '@/data/content/message-board-content'
import { SectionTitle } from '@/components/layout/section-title'

const { recentMessagesLabel } = messageBoardContent

/** Renders the localized "Recent Messages" section title for the message board. */
export function MessageBoardRecentLabel() {
  return <SectionTitle>{recentMessagesLabel}</SectionTitle>
}
