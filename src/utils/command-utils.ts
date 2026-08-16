import type { CommandItem } from '@/types/command'

interface CommandLabelPart {
  text: string
  match: boolean
}

/**
 * A query worked out once and reused across every row, rather than re-parsed per item. The patterns
 * are what pick the matched run out of a label, and are null when there is nothing to match.
 */
export interface PreparedCommandQuery {
  terms: readonly string[]
  labelPattern: RegExp | null
  exactLabelPattern: RegExp | null
}

/** Everything an item can be found by, including the preview copy attached to written content */
function searchableText(item: CommandItem) {
  return [item.label, item.meta, item.excerpt, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

/** Words in the query, deduplicated so typing the same word twice does not narrow anything */
export function prepareCommandQuery(query: string): PreparedCommandQuery {
  const terms = [...new Set(query.trim().toLowerCase().split(/\s+/).filter(Boolean))]

  if (terms.length === 0) {
    return { terms, labelPattern: null, exactLabelPattern: null }
  }

  const alternation = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|')

  return {
    terms,
    labelPattern: new RegExp(`(${alternation})`, 'i'),
    exactLabelPattern: new RegExp(`^(?:${alternation})$`, 'i'),
  }
}

/**
 * Whether an item survives the query. Every word has to appear somewhere in the item, so words can
 * be typed in any order and each one narrows the list further.
 */
export function matchesCommandQuery(item: CommandItem, query: PreparedCommandQuery) {
  const { terms } = query
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
export function splitLabelByQuery(
  label: string,
  { labelPattern, exactLabelPattern }: PreparedCommandQuery,
): CommandLabelPart[] {
  if (!labelPattern || !exactLabelPattern) return [{ text: label, match: false }]

  const parts = label.split(labelPattern).filter(Boolean)

  return parts.map((text) => ({ text, match: exactLabelPattern.test(text) }))
}
