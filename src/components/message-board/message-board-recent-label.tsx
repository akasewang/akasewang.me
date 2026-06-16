import { SectionTitle } from '@/components/layout/section-title'
import { messageBoardContent } from '@/data/content/message-board-content'

const { recentMessagesLabel } = messageBoardContent

export function MessageBoardRecentLabel() {
  return <SectionTitle>{recentMessagesLabel}</SectionTitle>
}
