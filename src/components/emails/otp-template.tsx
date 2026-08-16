import { Heading, Section, Text } from 'react-email'
import type { EmailDateInput } from './email-template-shared'
import {
  EmailDissolve,
  EmailShell,
  EmailWordmark,
  emailFonts,
  emailLayout,
  emailTheme,
  formatEmailDate,
} from './email-template-shared'

interface OtpTemplateProps {
  code?: string
  expiresInMinutes?: number
  maxAttempts?: number
  requestedAt?: EmailDateInput
}

/** The styles only this template needs, on top of the shared layout */
const s = {
  code: {
    margin: '0 0 26px',
    fontFamily: emailFonts.mono,
    fontSize: '34px',
    lineHeight: '42px',
    letterSpacing: '0.16em',
    color: emailTheme.primary,
  },
} as const

/** Carries the sign in code to the owner, and goes nowhere else */
export const OtpTemplate = ({
  code = 'k7Rm$2Xq',
  expiresInMinutes = 10,
  maxAttempts = 5,
  requestedAt,
}: OtpTemplateProps) => {
  const meta = [formatEmailDate(requestedAt), 'admin access'].filter(Boolean).join(' · ')

  return (
    <EmailShell preview={`${code} is your admin code`}>
      <Section className="e-opener" style={emailLayout.opener}>
        <Text style={emailLayout.meta}>{meta}</Text>
        <Heading as="h1" className="e-headline" style={emailLayout.headline}>
          Your admin code.
        </Heading>
      </Section>

      <Section className="e-body" style={emailLayout.bodySection}>
        <Text style={s.code}>{code}</Text>

        <Text style={emailLayout.body}>
          It works for the next <span style={emailLayout.emphasis}>{expiresInMinutes} minutes</span>{' '}
          and gives up after {maxAttempts} wrong tries. Asking for another one retires this
          immediately.
        </Text>

        <Text style={emailLayout.bodyLast}>
          If this was not you then nothing has happened, and doing nothing is the whole of what is
          needed.
        </Text>
      </Section>

      <EmailDissolve />
      <EmailWordmark spaceAbove="44px" />
    </EmailShell>
  )
}
