import { Column, Heading, Img, Row, Section, Text } from '@react-email/components'
import type { EmailDateInput } from './email-template-shared'
import {
  EmailDissolve,
  EmailShell,
  EmailWordmark,
  LIST_MARK_SIZE,
  emailFonts,
  emailLayout,
  emailTheme,
  formatEmailDate,
  getListMarkUrl,
} from './email-template-shared'

interface WeeklySummaryTemplateProps {
  newEmails?: string[]
  summaryDate?: EmailDateInput
}

const VISIBLE_SIGNUPS = 3

const s = {
  address: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '14px',
    lineHeight: '22px',
    color: emailTheme.text,
    wordBreak: 'break-all' as const,
  },
  remainder: { ...emailLayout.micro, margin: '18px 0 0' },
} as const

const defaultEmails = [
  'alex.rivera@example.com',
  'sarah.j@techflow.io',
  'marcus.dev@github.com',
  'elara.vance@design.co',
  'noor.haddad@parallel.dev',
  't.okonkwo@fieldnotes.app',
  'jonas.kruger@studiolm.de',
  'priya.nair@quietloop.in',
  'm.laurent@atelier.fr',
  'sam.whitfield@northbound.co',
  'yuki.tanabe@hoshi.jp',
  'ines.correia@margem.pt',
]

export const WeeklySummaryTemplate = ({
  newEmails = defaultEmails,
  summaryDate,
}: WeeklySummaryTemplateProps) => {
  const subscriberCount = newEmails.length

  const headingText =
    subscriberCount === 1
      ? '1 new subscriber this week.'
      : `${subscriberCount} new subscribers this week.`

  const meta = [formatEmailDate(summaryDate), 'weekly summary'].filter(Boolean).join(' · ')

  const shown = newEmails.slice(0, VISIBLE_SIGNUPS)
  const remaining = subscriberCount - shown.length

  return (
    <EmailShell preview={headingText}>
      <Section className="e-opener" style={emailLayout.opener}>
        <Text style={emailLayout.meta}>{meta}</Text>
        <Heading as="h1" className="e-headline" style={emailLayout.headline}>
          {headingText}
        </Heading>
      </Section>

      {shown.length > 0 && (
        <Section className="e-body" style={emailLayout.bodySection}>
          <Text style={emailLayout.sectionLabel}>Recent signups</Text>

          {shown.map((email, index) => (
            <Row
              key={email}
              style={index === shown.length - 1 ? emailLayout.listRowLast : emailLayout.listRow}
            >
              <Column style={emailLayout.markCol}>
                <Img
                  src={getListMarkUrl(index)}
                  width={LIST_MARK_SIZE}
                  height={LIST_MARK_SIZE}
                  alt=""
                  style={emailLayout.mark}
                />
              </Column>
              <Column style={emailLayout.rowCol}>
                <Text style={s.address}>{email}</Text>
              </Column>
            </Row>
          ))}

          {remaining > 0 && (
            <Text style={s.remainder}>
              and {remaining} more {remaining === 1 ? 'address' : 'addresses'}
            </Text>
          )}
        </Section>
      )}

      <EmailDissolve />

      <EmailWordmark spaceAbove="44px" />
    </EmailShell>
  )
}
