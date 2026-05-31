import { Inter, Geist_Mono, PT_Serif } from 'next/font/google'

/**
 * Next.js optimized Google Fonts configuration.
 * These fonts are instantiated here and injected into the DOM via CSS variables
 */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const fontSerif = PT_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '700'],
})
