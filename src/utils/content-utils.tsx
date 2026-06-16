import type { ReactNode } from 'react'
import { LinkText } from '@/components/ui/link-text'
import { LINK_REGEX } from '@/constants/constants'

export function renderWithLinks(text: string): ReactNode {
  if (!text) return text

  const flags = LINK_REGEX.flags.includes('g') ? LINK_REGEX.flags : `${LINK_REGEX.flags}g`
  const regex = new RegExp(LINK_REGEX.source, flags)

  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(regex)) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    parts.push(
      <LinkText key={match.index} href={match[2]}>
        {match[1]}
      </LinkText>,
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex === 0) return text

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}
