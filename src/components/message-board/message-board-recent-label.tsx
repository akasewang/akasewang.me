import { SectionTitle } from '@/components/layout/section-title'
import { messageBoardContent } from '@/data/content/message-board-content'

const { recentMessagesLabel } = messageBoardContent

/**
 * The heading above the messages, shared by the page and its loading skeleton so the title does not
 * shift as one gives way to the other.
 */
export function MessageBoardRecentLabel() {
  return <SectionTitle>{recentMessagesLabel}</SectionTitle>
}
