import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { FULL_NAME, SITE, SITE_URL } from '@/constants/constants'
import { EmailHeader, emailFonts, emailStyles, emailTheme } from './email-template-shared'

interface WelcomeTemplateProps {
  unsubscribeToken?: string
  isResubscribe?: boolean
  optInDate?: string | number | Date
}

const styles = {
  ...emailStyles,
  bodyText: {
    margin: '0 0 16px',
    fontFamily: emailFonts.sans,
    fontSize: '15px',
    lineHeight: 1.65,
    color: emailTheme.muted,
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
}

export const WelcomeTemplate = ({
  unsubscribeToken = 'preview-token',
  isResubscribe = false,
  optInDate,
}: WelcomeTemplateProps) => {
  const previewText = isResubscribe
    ? `Good to have you back - ${FULL_NAME}`
    : `You're on the list - ${FULL_NAME}`

  const eyebrow = isResubscribe ? 'welcome back' : 'new subscriber'

  const titleText = isResubscribe ? 'Good to have you back.' : "You're on the list."

  const bodyText = isResubscribe
    ? `Welcome back. You'll hear from me when there's something worth reading.`
    : `Thanks for subscribing. You'll hear from me when there's something worth reading.`

  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>
        {previewText} {'​'.repeat(150)}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <EmailHeader date={optInDate} />

          <Section style={styles.mainSection}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Heading as="h1" style={styles.heading}>
              {titleText}
            </Heading>
            <Text style={styles.bodyText}>{bodyText}</Text>
            <Link href={SITE_URL} style={styles.ctaLink}>
              visit {SITE.toLowerCase()}
            </Link>
          </Section>

          <Section style={styles.footerSection}>
            <Text style={styles.footerSecondary}>
              Don&apos;t want these?{' '}
              <Link href={unsubscribeUrl} style={styles.footerLinkDim}>
                unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
