import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import type { ReactNode } from 'react'
import { FULL_NAME, SITE_URL, USERNAME } from '@/constants/constants'

export type EmailDateInput = string | number | Date

export const emailFonts = {
  mono: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
  sans: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif',
} as const

export const emailTheme = {
  bg: '#ffffff',
  bodyBg: '#f5f5f7',
  border: '#e5e5ea',
  text: '#1c1c1e',
  muted: '#6e6e73',
  dim: '#8e8e93',
  link: '#2563eb',
} as const

export const emailStyles = {
  body: {
    backgroundColor: emailTheme.bodyBg,
    margin: 0,
    padding: '40px 16px',
    fontFamily: emailFonts.sans,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: emailTheme.bg,
    border: `1px solid ${emailTheme.border}`,
  },
  headerSection: {
    padding: '20px 32px',
    borderBottom: `1px solid ${emailTheme.border}`,
  },
  headerNameCol: { verticalAlign: 'middle' as const },
  headerDateCol: { verticalAlign: 'middle' as const },
  headerName: {
    margin: 0,
    fontFamily: emailFonts.sans,
    fontSize: '13px',
    fontWeight: 500,
    color: emailTheme.text,
    lineHeight: '16px',
  },
  headerHandle: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    color: emailTheme.link,
    lineHeight: '16px',
    textDecoration: 'none',
  },
  dateText: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '12px',
    color: emailTheme.dim,
  },
  mainSection: { padding: '40px 32px 36px' },
  eyebrow: {
    margin: '0 0 14px',
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    color: emailTheme.dim,
    lineHeight: '16px',
  },
  heading: {
    margin: '0 0 24px',
    fontFamily: emailFonts.sans,
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: 1.2,
    letterSpacing: '-0.022em',
    color: emailTheme.text,
  },
  ctaLink: {
    display: 'inline-block',
    fontFamily: emailFonts.mono,
    fontSize: '12px',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '8px 14px',
    backgroundColor: emailTheme.link,
    border: `1px solid ${emailTheme.link}`,
    lineHeight: '16px',
  },
  footerSection: {
    borderTop: `1px dashed ${emailTheme.border}`,
    padding: '18px 32px 22px',
  },
  footerSecondary: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '10px',
    color: emailTheme.dim,
    lineHeight: '16px',
  },
  footerLinkDim: { color: emailTheme.link, textDecoration: 'none' },
} as const

const formatEmailDate = (date?: EmailDateInput) =>
  Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date ? new Date(date) : new Date())
    .replaceAll('/', '.')

export function EmailHeader({ date }: { date?: EmailDateInput }) {
  return (
    <Section style={emailStyles.headerSection}>
      <Row>
        <Column style={emailStyles.headerNameCol}>
          <Text style={emailStyles.headerName}>{FULL_NAME}</Text>
          <Link href={SITE_URL} style={emailStyles.headerHandle}>
            {USERNAME}.me
          </Link>
        </Column>
        <Column align="right" style={emailStyles.headerDateCol}>
          <Text style={emailStyles.dateText}>{formatEmailDate(date)}</Text>
        </Column>
      </Row>
    </Section>
  )
}

export function EmailShell({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>
        {preview} {'​'.repeat(150)}
      </Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>{children}</Container>
      </Body>
    </Html>
  )
}

export function EmailUnsubscribeFooter({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return (
    <Section style={emailStyles.footerSection}>
      <Text style={emailStyles.footerSecondary}>
        Don&apos;t want these?{' '}
        <Link href={unsubscribeUrl} style={emailStyles.footerLinkDim}>
          unsubscribe
        </Link>
      </Text>
    </Section>
  )
}
