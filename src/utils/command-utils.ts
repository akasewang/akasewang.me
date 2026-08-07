import type { CommandItem } from '@/types/command'

interface CommandLabelPart {
  text: string
  match: boolean
}

/** Everything an item can be found by, so a search hits its date and keywords as well as its name */
function searchableText(item: CommandItem) {
  return [item.label, item.meta, ...(item.keywords ?? [])].filter(Boolean).join(' ').toLowerCase()
}

/** Words in the query, deduplicated so typing the same word twice does not narrow anything */
function queryTerms(query: string) {
  return [...new Set(query.trim().toLowerCase().split(/\s+/).filter(Boolean))]
}

/**
 * Whether an item survives the query. Every word has to appear somewhere in the item, so words can
 * be typed in any order and each one narrows the list further.
 */
export function matchesCommandQuery(item: CommandItem, query: string) {
  const terms = queryTerms(query)
  if (terms.length === 0) return true

  const text = searchableText(item)
  return terms.every((term) => text.includes(term))
}

/**
 * Cuts a label into matched and unmatched runs so the palette can bolden the part that was typed.
 *
 * Terms are escaped before going into the pattern, since a query is whatever was typed and may
 * hold characters a regular expression reads as syntax. Longest first, so where one term is the
 * start of another the longer match wins and the highlight covers the whole of what was typed.
 */
export function splitLabelByQuery(label: string, query: string): CommandLabelPart[] {
  const terms = queryTerms(query)
  if (terms.length === 0) return [{ text: label, match: false }]

  const escaped = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)

  const alternation = escaped.join('|')
  const parts = label.split(new RegExp(`(${alternation})`, 'gi')).filter(Boolean)
  const isTerm = new RegExp(`^(?:${alternation})$`, 'i')

  return parts.map((text) => ({ text, match: isTerm.test(text) }))
}
