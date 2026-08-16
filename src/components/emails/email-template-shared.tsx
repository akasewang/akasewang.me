import type { ReactNode } from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'
import { FIRST_NAME, SITE, SITE_URL } from '@/constants/constants'
import { activeSocials, type SocialLabel } from '@/data/static/social'

/** Whatever a caller happens to hold a date as, since formatEmailDate takes it from there */
export type EmailDateInput = string | number | Date

/** Web fonts for the emails, with the stacks a client that blocks them falls back to */
export const emailFonts = {
  mono: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
  sans: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif',
} as const

/** The palette and spacing the templates share, so every email looks like the same sender */
export const emailTheme = {
  page: '#030303',
  card: '#0f0f0f',
  primary: '#f5f5f5',
  text: '#bababa',
  muted: '#8a8a8a',
  dim: '#737373',
  accent: '#8bbcef',
} as const

const EMAIL_GUTTER = '48px'

/**
 * Every image is an absolute URL on the site and is given its size in the markup. Mail clients do
 * not run CSS the way a browser does, so anything drawn has to be a real image with real dimensions.
 */
const AVATAR_URL = `${SITE_URL}/email/avatar.png`
const AVATAR_SIZE = 30
const DISSOLVE_URL = `${SITE_URL}/email/footer-transition.png`
const DISSOLVE_WIDTH = 600
const DISSOLVE_HEIGHT = 96
const WORDMARK_URL = `${SITE_URL}/email/wordmark-foot.png`
const WORDMARK_WIDTH = 600
const WORDMARK_HEIGHT = 58

/** Three marks cycled down a list, since a bullet is a character a client may not have */
const LIST_MARK_COUNT = 3
export const LIST_MARK_SIZE = 16
export const getListMarkUrl = (index: number) =>
  `${SITE_URL}/email/link-mark-${(index % LIST_MARK_COUNT) + 1}.png`

const bodyType = {
  fontFamily: emailFonts.sans,
  fontSize: '15px',
  lineHeight: '27px',
} as const

/**
 * Every style the templates use, as inline objects rather than classes. Mail clients strip style
 * sheets and support wildly different subsets of CSS, so this is the whole design system for email.
 */
export const emailLayout = {
  page: { width: '100%', backgroundColor: emailTheme.page, padding: 0 },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: emailTheme.card,
    border: 0,
    borderRadius: '0',
  },

  opener: { padding: `64px ${EMAIL_GUTTER} 56px` },
  meta: {
    margin: '0 0 18px',
    fontFamily: emailFonts.mono,
    fontSize: '10px',
    lineHeight: '16px',
    letterSpacing: '0.1em',
    color: emailTheme.dim,
    textTransform: 'lowercase' as const,
  },
  headline: {
    margin: 0,
    fontFamily: emailFonts.sans,
    fontSize: '34px',
    fontWeight: 400,
    lineHeight: '42px',
    letterSpacing: '-0.024em',
    color: emailTheme.primary,
  },

  bodySection: { padding: `0 ${EMAIL_GUTTER}` },
  body: { ...bodyType, margin: '0 0 22px', color: emailTheme.muted },
  bodyLast: { ...bodyType, margin: 0, color: emailTheme.muted },
  emphasis: { color: emailTheme.primary },
  link: {
    fontFamily: emailFonts.sans,
    fontSize: '14px',
    lineHeight: '22px',
    color: emailTheme.accent,
    textDecorationLine: 'none',
  },
  linkLine: {
    margin: 0,
    fontFamily: emailFonts.sans,
    fontSize: '14px',
    lineHeight: '22px',
  },
  micro: {
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    letterSpacing: '0.04em',
    lineHeight: '16px',
    color: emailTheme.dim,
    textTransform: 'lowercase' as const,
  },

  listSection: { padding: `64px ${EMAIL_GUTTER} 0` },
  sectionLabel: {
    margin: '0 0 26px',
    fontFamily: emailFonts.mono,
    fontSize: '9px',
    letterSpacing: '0.19em',
    lineHeight: '14px',
    color: emailTheme.dim,
    textTransform: 'lowercase' as const,
  },
  listRow: { marginBottom: '18px' },
  listRowLast: { marginBottom: '0' },
  markCol: { width: '26px', verticalAlign: 'top' as const },
  mark: {
    display: 'block',
    marginTop: '2px',
    border: 0,
    outline: 'none',
  },
  rowCol: { verticalAlign: 'top' as const },

  avatar: { display: 'block', border: 0, outline: 'none' },
  avatarCol: { width: `${AVATAR_SIZE + 14}px`, verticalAlign: 'middle' as const },
  signatureRow: { marginBottom: '22px' },
  signatureCol: { verticalAlign: 'middle' as const },
  signature: { ...bodyType, margin: 0, fontWeight: 400, color: emailTheme.primary },

  dissolveSection: {
    backgroundColor: emailTheme.card,
    padding: '64px 0 0',
    fontSize: 0,
    lineHeight: 0,
  },
  dissolveImage: {
    display: 'block',
    width: '100%',
    maxWidth: `${DISSOLVE_WIDTH}px`,
    height: 'auto',
    border: 0,
    outline: 'none',
  },

  footer: {
    backgroundColor: emailTheme.page,
    padding: `44px ${EMAIL_GUTTER} 44px`,
  },
  footerCol: { verticalAlign: 'middle' as const },

  wordmarkSection: { backgroundColor: emailTheme.page, padding: 0 },
  wordmark: {
    display: 'block',
    width: '100%',
    maxWidth: `${WORDMARK_WIDTH}px`,
    height: 'auto',
    border: 0,
    outline: 'none',
  },
} as const

const emailBodyStyle = {
  backgroundColor: emailTheme.page,
  margin: 0,
  padding: 0,
  fontFamily: emailFonts.sans,
  WebkitTextSizeAdjust: '100%',
  msTextSizeAdjust: '100%',
} as const

const darkModeCss = `
  :root {
    color-scheme: dark;
    supported-color-schemes: dark;
  }
  [data-ogsc] .e-page,
  [data-ogsb] .e-page { background-color: ${emailTheme.page} !important; }
  [data-ogsc] .e-card,
  [data-ogsb] .e-card { background-color: ${emailTheme.card} !important; }
  .e-photo {
    filter: none !important;
    -webkit-filter: none !important;
    mix-blend-mode: normal !important;
  }
  [data-ogsc] .e-photo,
  [data-ogsb] .e-photo {
    filter: none !important;
    -webkit-filter: none !important;
  }
  @media only screen and (max-width: 480px) {
    .e-opener {
      padding: 52px 24px 44px !important;
    }
    .e-body {
      padding-left: 24px !important;
      padding-right: 24px !important;
    }
    .e-list {
      padding: 52px 24px 0 !important;
    }
    .e-dissolve {
      padding-top: 52px !important;
    }
    .e-footer {
      padding: 36px 24px 36px !important;
    }
    .e-wordmark-gap {
      padding-top: 36px !important;
    }
    .e-headline {
      font-size: 28px !important;
      line-height: 36px !important;
    }
  }
  @media only screen and (max-width: 360px) {
    .e-opener,
    .e-body,
    .e-list,
    .e-footer {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }
`

/** An email may be opened weeks after it was sent, so dates are absolute rather than relative */
export const formatEmailDate = (date?: EmailDateInput) => {
  const value = date ? new Date(date) : new Date()
  if (Number.isNaN(value.getTime())) return ''

  return Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(value)
}

/** The document every email is built inside: the head, the dark scheme and the card */
export function EmailShell({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{darkModeCss}</style>
      </Head>
      {/**
       * The padding is zero width spaces. Without them a client fills the preview line with
       * whatever text comes next in the email, which is rarely what should be read first.
       */}
      <Preview>
        {preview} {'​'.repeat(150)}
      </Preview>
      <Body style={emailBodyStyle}>
        <Section className="e-page" style={{ ...emailLayout.page }}>
          <Container className="e-card" style={{ ...emailLayout.container }}>
            {children}
          </Container>
        </Section>
      </Body>
    </Html>
  )
}

/** The sign off: the avatar and a line beside it, as a table row since floats do not travel */
export function EmailSignature({ text }: { text: string }) {
  return (
    <Row style={emailLayout.signatureRow}>
      <Column style={emailLayout.avatarCol}>
        <Img
          className="e-photo"
          src={AVATAR_URL}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          alt=""
          style={emailLayout.avatar}
        />
      </Column>
      <Column style={emailLayout.signatureCol}>
        <Text style={emailLayout.signature}>{text}</Text>
      </Column>
    </Row>
  )
}

/** The graded band between the card and the footer, drawn as an image since gradients rarely work */
export function EmailDissolve() {
  return (
    <Section className="e-card e-dissolve" style={emailLayout.dissolveSection}>
      <Img
        src={DISSOLVE_URL}
        width={DISSOLVE_WIDTH}
        height={DISSOLVE_HEIGHT}
        alt=""
        style={emailLayout.dissolveImage}
      />
    </Section>
  )
}

/** The name at the foot of every email, as an image so it looks the same wherever it lands */
export function EmailWordmark({ spaceAbove }: { spaceAbove?: string }) {
  return (
    <Section
      className={spaceAbove ? 'e-page e-wordmark-gap' : 'e-page'}
      style={{ ...emailLayout.wordmarkSection, paddingTop: spaceAbove }}
    >
      <Img
        src={WORDMARK_URL}
        width={WORDMARK_WIDTH}
        height={WORDMARK_HEIGHT}
        alt={SITE}
        style={emailLayout.wordmark}
      />
    </Section>
  )
}

/** Typed against the labels themselves, so renaming one there breaks here rather than going quiet */
const FOOTER_SOCIAL_LABELS: SocialLabel[] = ['GitHub', 'LinkedIn', 'X (Twitter)']

const footerSocials = FOOTER_SOCIAL_LABELS.map((label) =>
  activeSocials.find((social) => social.label === label),
).filter((social): social is (typeof activeSocials)[number] => Boolean(social))

const subscriberFooterStyles = {
  about: {
    margin: '0 0 26px',
    fontFamily: emailFonts.sans,
    fontSize: '13px',
    fontWeight: 300,
    lineHeight: '24px',
    color: emailTheme.muted,
  },
  name: {
    color: emailTheme.accent,
    textDecorationLine: 'none',
    fontWeight: 500,
  },
  social: {
    ...emailLayout.micro,
    textDecorationLine: 'none',
    paddingRight: '20px',
  },
  unsubscribeCol: { verticalAlign: 'middle' as const, textAlign: 'right' as const },
  unsubscribe: {
    ...emailLayout.micro,
    color: emailTheme.accent,
    textDecorationLine: 'none',
  },
} as const

/**
 * The foot of anything sent to a subscriber: who this is from, and the way out. Only the mail that
 * someone signed up for carries it, since an unsubscribe link on a sign in code makes no sense.
 */
export function EmailSubscriberFooter({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return (
    <Section className="e-page e-footer" style={emailLayout.footer}>
      <Text style={subscriberFooterStyles.about}>
        I am{' '}
        <Link href={SITE_URL} style={subscriberFooterStyles.name}>
          {FIRST_NAME}
        </Link>
        . I build software and write up the parts that fought back. No schedule and no filler, only
        what turned out worth keeping.
      </Text>

      <Row>
        <Column style={emailLayout.footerCol}>
          {footerSocials.map((social) => (
            <Link key={social.href} href={social.href} style={subscriberFooterStyles.social}>
              {social.label.replace(' (Twitter)', '')}
            </Link>
          ))}
        </Column>
        <Column style={subscriberFooterStyles.unsubscribeCol}>
          <Link href={unsubscribeUrl} style={subscriberFooterStyles.unsubscribe}>
            Unsubscribe
          </Link>
        </Column>
      </Row>
    </Section>
  )
}
