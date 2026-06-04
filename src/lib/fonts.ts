import { Inter, Geist_Mono, PT_Serif } from 'next/font/google'

/**
 * Next.js-optimized Google Fonts configuration.
 * Each font is instantiated here and exposed to CSS via a custom property (`--font-*`).
 */

/** Primary sans-serif typeface for body and UI text. */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/** Monospace typeface for code, counters, and tabular numerals. */
export const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

/** Serif typeface for display headings and italic accents. */
export const fontSerif = PT_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '700'],
})
