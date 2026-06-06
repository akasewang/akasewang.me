import { type ReactNode } from 'react'
import { LinkText } from '@/components/ui/link-text'
import { LINK_REGEX } from '@/constants/constants'

/**
 * Renders a plain string into a ReactNode, converting inline markdown links
 * (`[label](url)`) into interactive `LinkText` elements.
 *
 * Useful for user provided text such as timeline items or bios, where full MDX
 * compilation is overkill but basic link interactivity is still needed.
 *
 * @param text - The raw text string, optionally containing markdown links.
 * @returns A ReactNode array of text segments and links, or the original string if it contains no links.
 */
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
