import { Column, Heading, Row, Section, Text } from '@react-email/components'
import {
  EmailHeader,
  EmailShell,
  emailFonts,
  emailStyles,
  emailTheme,
} from './email-template-shared'

interface WeeklySummaryTemplateProps {
  subscriberCount: number
  newEmails?: string[]
  summaryDate?: string | number | Date
}

const styles = {
  ...emailStyles,
  heading: {
    ...emailStyles.heading,
    margin: 0,
  },
  emailSection: {
    borderTop: `1px dashed ${emailTheme.border}`,
    padding: '28px 32px',
  },
  emailsLabel: {
    margin: '0 0 18px',
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    color: emailTheme.dim,
    lineHeight: '16px',
  },
  emailRow: { marginBottom: '14px' },
  emailIndexCol: { width: '32px', verticalAlign: 'top' as const },
  emailIndex: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    color: emailTheme.dim,
    lineHeight: '22px',
  },
  emailText: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '13px',
    color: emailTheme.text,
    lineHeight: '22px',
    wordBreak: 'break-all' as const,
  },
}

const defaultEmails = [
  'alex.rivera@example.com',
  'sarah.j@techflow.io',
  'marcus.dev@github.com',
  'elara.vance@design.co',
]

export const WeeklySummaryTemplate = ({
  subscriberCount = 12,
  newEmails = defaultEmails,
  summaryDate,
}: WeeklySummaryTemplateProps) => {
  const headingText =
    subscriberCount === 1
      ? '1 new subscriber this week.'
      : `${subscriberCount} new subscribers this week.`

  return (
    <EmailShell preview={headingText}>
      <EmailHeader date={summaryDate} />

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
    </EmailShell>
  )
}
