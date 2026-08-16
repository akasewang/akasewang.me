/**
 * Self hosted at build time by next/font, so there is no request to Google at runtime and no layout
 * shift. Each exposes a CSS variable that the Tailwind theme reads.
 */

import { Geist_Mono, Inter, PT_Serif } from 'next/font/google'

/** Body text and interface */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/** Code, dates, counters and anything that wants a fixed advance width */
export const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
})

/** Headings and pull quotes, which is why the italic is loaded as well as the roman */
export const fontSerif = PT_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '700'],
})
