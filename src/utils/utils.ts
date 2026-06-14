import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isYesterday, parse, isValid } from 'date-fns'
import {
  READING_SPEED,
  DATE_DISPLAY_FORMAT,
  LONG_DATE_DISPLAY_FORMAT,
  DATE_PARSING_PATTERNS,
  YEAR_REGEX,
  MONTH_YEAR_REGEX,
  FULL_DATE_REGEX,
  TEXT_MONTH_YEAR_REGEX,
  CAPITALIZE_REGEX,
  TWO_WEEKS_MS,
  PRESENT,
} from '../constants/constants'

/**
 * Merges class names with `clsx` and resolves conflicting Tailwind utilities via `tailwind-merge`.
 *
 * @param inputs - An array of class values, objects, or strings.
 * @returns A single unified class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the estimated reading time in minutes for a given text block.
 * Based on a constant words per minute reading speed.
 *
 * @param content - The raw text content to analyze.
 * @returns The estimated time in minutes (rounded up).
 */
export function getReadingTime(content: string): number {
  const trimmed = content.trim()
  return trimmed ? Math.ceil(trimmed.split(/\s+/).length / READING_SPEED) : 0
}

/**
 * Robustly parses a date string or object against multiple known formats.
 * Prevents "Invalid Date" errors from crashing the UI.
 *
 * @param dateStr - The input date string or Date object.
 * @returns A valid Javascript Date object, or null if the input is unparseable.
 */
export function parseAnyDate(dateStr?: string | Date): Date | null {
  if (!dateStr) return null

  if (dateStr instanceof Date) return isValid(dateStr) ? dateStr : null

  if (typeof dateStr !== 'string') return null

  const normalized = dateStr.trim()
  /** Treat 'Present' (e.g., current job role) as a null date to prevent parsing errors */
  if (normalized.toLowerCase() === PRESENT.toLowerCase()) return null

  /** Use current date as the reference point for relative parsing */
  const referenceDate = new Date()

  for (const fmt of DATE_PARSING_PATTERNS) {
    const parsedDate = parse(normalized, fmt, referenceDate)
    if (isValid(parsedDate)) return parsedDate
  }

  /** Fallback to native browser Date parsing if all date-fns patterns fail */
  const nativeDate = new Date(normalized)
  return isValid(nativeDate) ? nativeDate : null
}

/**
 * Parses a date and returns its ISO 8601 string representation.
 * Defaults to the current date if the input is invalid.
 *
 * @param dateStr - The input date.
 * @returns An ISO formatted string (e.g., `2024-01-01T00:00:00.000Z`).
 */
export function parseDate(dateStr?: string | Date): string {
  return (parseAnyDate(dateStr) || new Date()).toISOString()
}

/**
 * Capitalizes the first letter of each word in a given name or string.
 *
 * @param name - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeName(name: string): string {
  return name.replace(CAPITALIZE_REGEX, (c) => c.toUpperCase())
}

/**
 * Formats a Date object into a readable lowercase 12-hour time format.
 * Example: `2:30 pm`.
 *
 * @param date - The valid Date object to format.
 * @returns A formatted time string.
 */
export function formatTime(date: Date): string {
  return format(date, 'h:mm a').toLowerCase()
}

/**
 * Generates a relative day label ('Today', 'Yesterday') or a formatted date string for older dates.
 * Often used in chat UI or message boards.
 *
 * @param date - The valid Date object.
 * @returns A relative string or a full date.
 */
export function formatDayLabel(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, LONG_DATE_DISPLAY_FORMAT)
}

/**
 * Formats a date string adaptively based on its inherent specificity.
 * If the string only specifies a year (e.g., "2023"), it only returns the year.
 * Handles exact matching for the 'Present' constant.
 *
 * @param dateStr - The date string or object to display.
 * @returns A UI ready formatted date string.
 */
export function formatDateString(dateStr?: string | Date): string {
  if (!dateStr) return ''

  if (typeof dateStr === 'string' && dateStr.trim().toLowerCase() === PRESENT.toLowerCase()) {
    return PRESENT
  }

  const date = parseAnyDate(dateStr)

  if (typeof dateStr === 'string') {
    /** If parsing failed, fall back to returning the raw unparsed string instead of losing it. */
    if (!date) return dateStr

    const normalized = dateStr.trim()
    if (YEAR_REGEX.test(normalized)) return format(date, 'yyyy')

    if (MONTH_YEAR_REGEX.test(normalized) || TEXT_MONTH_YEAR_REGEX.test(normalized))
      return format(date, 'MM.yyyy')

    if (FULL_DATE_REGEX.test(normalized)) return format(date, 'dd.MM.yyyy')
  } else if (!date) {
    return ''
  }

  return format(date, DATE_DISPLAY_FORMAT)
}

/**
 * Creates consistent visuals for users without avatars by hashing their name.
 *
 * @param name - The seed string (e.g., username) to hash.
 * @returns An object containing the generated `backgroundImage`, `colors` array and `angle`.
 */
export function generateGradientFromName(name: string) {
  /** Calculate a deterministic integer hash from the string characters */
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)

  /** Pseudorandom number generator seeded by the hash */
  const random = (seedOffset: number) => {
    const x = Math.sin(hash + seedOffset) * 10000
    return x - Math.floor(x)
  }

  const getColor = (offset: number) =>
    `hsl(${Math.floor(random(offset) * 360)}, ${Math.floor(random(offset + 1) * 30 + 70)}%, ${Math.floor(random(offset + 2) * 15 + 75)}%)`

  const c1 = getColor(10)
  const c2 = getColor(20)
  const c3 = getColor(30)

  /** Use the seed to randomly pick a gradient style, angle and focal point */
  const patternType = random(40)
  const angle = Math.floor(random(50) * 360)
  const posX = Math.floor(random(60) * 100)
  const posY = Math.floor(random(70) * 100)

  if (patternType < 0.33) {
    return {
      backgroundImage: `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
      colors: [c1, c2, c3],
      angle,
    }
  }

  if (patternType < 0.66) {
    return {
      backgroundImage: `radial-gradient(circle at ${posX}% ${posY}%, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
      colors: [c1, c2, c3],
      angle,
    }
  }

  return {
    backgroundImage: `conic-gradient(from ${angle}deg at ${posX}% ${posY}%, ${c1}, ${c2}, ${c3}, ${c1})`,
    colors: [c1, c2, c3],
    angle,
  }
}

/**
 * Determines whether a given date falls within the designated recent window (e.g., the last 30 days).
 * Used to trigger "New" badges on UI components.
 *
 * @param dateStr - The date to check against the current time.
 * @returns True if the date is within the new window.
 */
export function isNew(dateStr?: string | Date): boolean {
  const date = parseAnyDate(dateStr)
  if (!date) return false

  const diff = Date.now() - date.getTime()
  return diff >= -86400000 && diff <= TWO_WEEKS_MS
}
