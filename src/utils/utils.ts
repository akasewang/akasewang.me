import { type ClassValue, clsx } from 'clsx'
import { format, isToday, isValid, isYesterday, parse } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import {
  CAPITALIZE_REGEX,
  DATE_DISPLAY_FORMAT,
  DATE_PARSING_PATTERNS,
  FULL_DATE_REGEX,
  LONG_DATE_DISPLAY_FORMAT,
  MONTH_YEAR_REGEX,
  PRESENT,
  READING_SPEED,
  TEXT_MONTH_YEAR_REGEX,
  TWO_WEEKS_MS,
  YEAR_REGEX,
} from '../constants/constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReadingTime(content: string): number {
  const trimmed = content.trim()
  return trimmed ? Math.ceil(trimmed.split(/\s+/).length / READING_SPEED) : 0
}

export function parseAnyDate(dateStr?: string | Date): Date | null {
  if (!dateStr) return null

  if (dateStr instanceof Date) return isValid(dateStr) ? dateStr : null

  if (typeof dateStr !== 'string') return null

  const normalized = dateStr.trim()

  if (normalized.toLowerCase() === PRESENT.toLowerCase()) return null

  const referenceDate = new Date()

  for (const fmt of DATE_PARSING_PATTERNS) {
    const parsedDate = parse(normalized, fmt, referenceDate)
    if (isValid(parsedDate)) return parsedDate
  }

  const nativeDate = new Date(normalized)
  return isValid(nativeDate) ? nativeDate : null
}

export function parseDate(dateStr?: string | Date): string {
  return (parseAnyDate(dateStr) || new Date()).toISOString()
}

export function capitalizeName(name: string): string {
  return name.replace(CAPITALIZE_REGEX, (c) => c.toUpperCase())
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a').toLowerCase()
}

export function formatDayLabel(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, LONG_DATE_DISPLAY_FORMAT)
}

export function formatDateString(dateStr?: string | Date): string {
  if (!dateStr) return ''

  if (typeof dateStr === 'string' && dateStr.trim().toLowerCase() === PRESENT.toLowerCase()) {
    return PRESENT
  }

  const date = parseAnyDate(dateStr)

  if (typeof dateStr === 'string') {
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

export function generateGradientFromName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)

  const random = (seedOffset: number) => {
    const x = Math.sin(hash + seedOffset) * 10000
    return x - Math.floor(x)
  }

  const getColor = (offset: number) =>
    `hsl(${Math.floor(random(offset) * 360)}, ${Math.floor(random(offset + 1) * 30 + 70)}%, ${Math.floor(random(offset + 2) * 15 + 75)}%)`

  const c1 = getColor(10)
  const c2 = getColor(20)
  const c3 = getColor(30)

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

export function isNew(dateStr?: string | Date): boolean {
  const date = parseAnyDate(dateStr)
  if (!date) return false

  const diff = Date.now() - date.getTime()
  return diff >= -86400000 && diff <= TWO_WEEKS_MS
}
