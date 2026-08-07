export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * The anchor a heading is reachable by. Built the same way the renderer builds its own heading ids,
 * so a contents entry and the heading it points at always agree.
 */
export const generateId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * The headings of a post, in the order they appear, for building its table of contents.
 *
 * Content arrives either as rendered HTML or as raw markdown, so both are handled: HTML headings
 * already carry the id to link to, while markdown ones have theirs derived from the text. Fenced
 * code is dropped before the markdown pass, since a comment inside a snippet opens with the same
 * hashes a heading does and would otherwise be listed as one.
 *
 * Only h2 to h4 are collected. The title is the h1 and anything deeper is too fine to navigate by.
 */
export function parseTocFromContent(content: string): TocItem[] {
  const items: TocItem[] = []
  const htmlMatches = Array.from(
    content.matchAll(/<h([2-4])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/gi),
  )

  if (htmlMatches.length > 0) {
    for (const match of htmlMatches) {
      const text = match[3].replace(/<[^>]*>/g, '').trim()
      if (match[2] && text) items.push({ id: match[2], text, level: parseInt(match[1], 10) })
    }
    return items
  }

  const stripped = content.replace(/```[\s\S]*?```/g, '')
  for (const match of stripped.matchAll(/^(#{2,4})\s+(.+)$/gm)) {
    const text = match[2].trim()
    const id = generateId(text)
    if (id && text) items.push({ id, text, level: match[1].length })
  }

  return items
}
