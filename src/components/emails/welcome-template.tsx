import { Heading, Link, Section, Text } from '@react-email/components'
import { FIRST_NAME, FULL_NAME, SITE_URL } from '@/constants/constants'
import type { EmailDateInput } from './email-template-shared'
import {
  EmailDissolve,
  EmailShell,
  EmailSignature,
  EmailSubscriberFooter,
  EmailWordmark,
  emailLayout,
  formatEmailDate,
} from './email-template-shared'

interface WelcomeTemplateProps {
  unsubscribeToken?: string
  isResubscribe?: boolean
  optInDate?: EmailDateInput
}

/** The first email a new subscriber receives */
export const WelcomeTemplate = ({
  unsubscribeToken = 'preview-token',
  isResubscribe = false,
  optInDate,
}: WelcomeTemplateProps) => {
  const previewText = isResubscribe
    ? `Good to have you back - ${FULL_NAME}`
    : `You're on the list - ${FULL_NAME}`

  const titleText = isResubscribe ? 'Good to have you back.' : "You're on the list."

  const meta = [formatEmailDate(optInDate), isResubscribe ? 'welcome back' : 'new subscriber']
    .filter(Boolean)
    .join(' · ')

  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`

  return (
    <EmailShell preview={previewText}>
      <Section className="e-opener" style={emailLayout.opener}>
        <Text style={emailLayout.meta}>{meta}</Text>
        <Heading as="h1" className="e-headline" style={emailLayout.headline}>
          {titleText}
        </Heading>
      </Section>

      <Section className="e-body" style={emailLayout.bodySection}>
        <EmailSignature text={`${FIRST_NAME} here.`} />

        <Text style={emailLayout.body}>
          {isResubscribe
            ? 'Welcome back. Nothing has changed while you were gone: no schedule, no filler.'
            : 'Thanks for subscribing. There is no schedule and no filler here, which is the whole point of it.'}{' '}
          <span style={emailLayout.emphasis}>
            You&apos;ll hear from me when there&apos;s something worth reading
          </span>
          , and not before.
        </Text>

        <Text style={emailLayout.body}>
          Everything I have written so far is on the site, if you would rather not wait for the next
          one to turn up.
        </Text>

        <Text style={emailLayout.linkLine}>
          <Link href={SITE_URL} style={emailLayout.link}>
            Read what is already there &rsaquo;
          </Link>
        </Text>
      </Section>

      <EmailDissolve />
      <EmailSubscriberFooter unsubscribeUrl={unsubscribeUrl} />
      <EmailWordmark />
    </EmailShell>
  )
}
