import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Heading,
} from '@react-email/components'
import { SITE_URL, FULL_NAME, USERNAME } from '@/constants/constants'

/** Props for the weekly admin subscriber-summary email. */
interface WeeklySummaryTemplateProps {
  subscriberCount: number
  newEmails?: string[]
  summaryDate?: string | number | Date
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
    margin: 0,
    fontFamily: sans,
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: 1.2,
    letterSpacing: '-0.022em',
    color: theme.text,
  },
  emailSection: {
    borderTop: `1px dashed ${theme.border}`,
    padding: '28px 32px',
  },
  emailsLabel: {
    margin: '0 0 18px',
    fontFamily: mono,
    fontSize: '11px',
    color: theme.dim,
    lineHeight: '16px',
  },
  emailRow: { marginBottom: '14px' },
  emailIndexCol: { width: '32px', verticalAlign: 'top' as const },
  emailIndex: {
    margin: 0,
    fontFamily: mono,
    fontSize: '11px',
    color: theme.dim,
    lineHeight: '22px',
  },
  emailText: {
    margin: 0,
    fontFamily: mono,
    fontSize: '13px',
    color: theme.text,
    lineHeight: '22px',
    wordBreak: 'break-all' as const,
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
}

const defaultEmails = [
  'alex.rivera@example.com',
  'sarah.j@techflow.io',
  'marcus.dev@github.com',
  'elara.vance@design.co',
]

/** Admin digest email summarizing the subscribers gained over the past week. */
export const WeeklySummaryTemplate = ({
  subscriberCount = 12,
  newEmails = defaultEmails,
  summaryDate,
}: WeeklySummaryTemplateProps) => {
  const formattedDateString = Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(summaryDate ? new Date(summaryDate) : new Date())
    .replaceAll('/', '.')

  const profilePicUrl = `${SITE_URL}/profpic.png`
  const handle = `${USERNAME}.me`

  const headingText =
    subscriberCount === 1
      ? '1 new subscriber this week.'
      : `${subscriberCount} new subscribers this week.`

  return (
    <Html>
      <Head />
      <Preview>
        {headingText} {'​'.repeat(150)}
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
            <Text style={styles.eyebrow}>weekly summary</Text>
            <Heading as="h1" style={styles.heading}>
              {headingText}
            </Heading>
          </Section>

          {newEmails.length > 0 && (
            <Section style={styles.emailSection}>
              <Text style={styles.emailsLabel}>recent signups</Text>
              {newEmails.map((email, index) => (
                <Row key={index} style={styles.emailRow}>
                  <Column style={styles.emailIndexCol}>
                    <Text style={styles.emailIndex}>{String(index + 1).padStart(2, '0')}</Text>
                  </Column>
                  <Column>
                    <Text style={styles.emailText}>{email}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Section style={styles.footerSection}>
            <Text style={styles.footerSecondary}>Weekly digest · automated notification</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
