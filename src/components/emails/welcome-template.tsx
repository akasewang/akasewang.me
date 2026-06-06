import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Heading,
} from '@react-email/components'
import { SITE_URL, FULL_NAME, USERNAME, SITE } from '@/constants/constants'

/** Props for the subscriber welcome email. */
interface WelcomeTemplateProps {
  unsubscribeToken: string
  isResubscribe?: boolean
  optInDate?: string | number | Date
}

const mono = 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace'
const sans = '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif'

const theme = {
  bg: '#ffffff',
  bodyBg: '#f5f5f7',
  border: '#e5e5ea',
  borderStrong: '#d1d1d6',
  text: '#1c1c1e',
  muted: '#6e6e73',
  dim: '#8e8e93',
  link: '#2563eb',
}

const styles = {
  body: {
    backgroundColor: theme.bodyBg,
    margin: 0,
    padding: '40px 16px',
    fontFamily: sans,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
  },
  headerSection: {
    padding: '20px 32px',
    borderBottom: `1px solid ${theme.border}`,
  },
  headerAvatarCol: { width: '32px', verticalAlign: 'middle' as const },
  headerNameCol: { paddingLeft: '12px', verticalAlign: 'middle' as const },
  headerDateCol: { verticalAlign: 'middle' as const },
  profileImg: {
    display: 'block',
    border: `1px solid ${theme.borderStrong}`,
    borderRadius: '9999px',
  },
  headerName: {
    margin: 0,
    fontFamily: sans,
    fontSize: '13px',
    fontWeight: 500,
    color: theme.text,
    lineHeight: '16px',
  },
  headerHandle: {
    margin: 0,
    fontFamily: mono,
    fontSize: '11px',
    color: theme.link,
    lineHeight: '16px',
  },
  dateText: { margin: 0, fontFamily: mono, fontSize: '12px', color: theme.dim },
  mainSection: { padding: '40px 32px 36px' },
  eyebrow: {
    margin: '0 0 14px',
    fontFamily: mono,
    fontSize: '11px',
    color: theme.dim,
    lineHeight: '16px',
  },
  heading: {
    margin: '0 0 24px',
    fontFamily: sans,
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: 1.2,
    letterSpacing: '-0.022em',
    color: theme.text,
  },
  bodyText: {
    margin: '0 0 16px',
    fontFamily: sans,
    fontSize: '15px',
    lineHeight: 1.65,
    color: theme.muted,
  },
  ctaLink: {
    display: 'inline-block',
    fontFamily: mono,
    fontSize: '12px',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '8px 14px',
    backgroundColor: theme.link,
    border: `1px solid ${theme.link}`,
    lineHeight: '16px',
  },
  footerSection: {
    borderTop: `1px dashed ${theme.border}`,
    padding: '18px 32px 22px',
  },
  footerSecondary: {
    margin: 0,
    fontFamily: mono,
    fontSize: '10px',
    color: theme.dim,
    lineHeight: '16px',
  },
  footerLinkDim: { color: theme.link, textDecoration: 'none' },
}

/** Welcome email sent on a new or returning subscription, with a one click unsubscribe link. */
export const WelcomeTemplate = ({
  unsubscribeToken,
  isResubscribe = false,
  optInDate,
}: WelcomeTemplateProps) => {
  const previewText = isResubscribe
    ? `Good to have you back — ${FULL_NAME}`
    : `You're on the list — ${FULL_NAME}`

  const eyebrow = isResubscribe ? 'welcome back' : 'new subscriber'

  const titleText = isResubscribe ? 'Good to have you back.' : "You're on the list."

  const bodyText = isResubscribe
    ? `Welcome back. You'll hear from me when there's something worth reading: new posts, occasional thoughts, nothing more.`
    : `Thanks for subscribing. You'll hear from me when there's something worth reading: new posts, occasional thoughts, nothing more.`

  const formattedDateString = Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(optInDate ? new Date(optInDate) : new Date())
    .replaceAll('/', '.')

  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`
  const profilePicUrl = `${SITE_URL}/profpic.png`
  const handle = `${USERNAME}.me`

  return (
    <Html>
      <Head />
      <Preview>
        {previewText} {'​'.repeat(150)}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.headerSection}>
            <Row>
              <Column style={styles.headerAvatarCol}>
                <Img
                  src={profilePicUrl}
                  width="32"
                  height="32"
                  alt={FULL_NAME}
                  style={styles.profileImg}
                />
              </Column>
              <Column style={styles.headerNameCol}>
                <Text style={styles.headerName}>{FULL_NAME}</Text>
                <Text style={styles.headerHandle}>{handle}</Text>
              </Column>
              <Column align="right" style={styles.headerDateCol}>
                <Text style={styles.dateText}>{formattedDateString}</Text>
              </Column>
            </Row>
          </Section>

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
              Don't want these?{' '}
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
