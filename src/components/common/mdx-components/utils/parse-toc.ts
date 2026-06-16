export interface TocItem {
  id: string
  text: string
  level: number
}

export const generateId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

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
