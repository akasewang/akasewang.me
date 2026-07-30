import { Heading, Link, Section, Text } from '@react-email/components'
import { FULL_NAME, SITE, SITE_URL } from '@/constants/constants'
import {
  EmailHeader,
  EmailShell,
  EmailUnsubscribeFooter,
  emailFonts,
  emailStyles,
  emailTheme,
} from './email-template-shared'

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
    <EmailShell preview={previewText}>
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

      <EmailUnsubscribeFooter unsubscribeUrl={unsubscribeUrl} />
    </EmailShell>
  )
}
