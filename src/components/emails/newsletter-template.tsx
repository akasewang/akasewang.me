import { Column, Heading, Img, Link, Row, Section, Text } from '@react-email/components'
import { FIRST_NAME, SITE_URL } from '@/constants/constants'
import type { EmailDateInput } from './email-template-shared'
import {
  EmailDissolve,
  EmailShell,
  EmailSignature,
  EmailSubscriberFooter,
  EmailWordmark,
  LIST_MARK_SIZE,
  emailLayout,
  formatEmailDate,
  getListMarkUrl,
} from './email-template-shared'

interface NewsletterPost {
  title: string
  url: string
}

interface NewsletterTemplateProps {
  unsubscribeToken?: string
  blogTitle?: string
  blogUrl?: string
  blogExcerpt?: string
  blogDate?: EmailDateInput
  readingTime?: number
  previousPosts?: NewsletterPost[]
}

const defaultPosts: NewsletterPost[] = [
  {
    title: 'Building a Minimalist Writing Environment',
    url: `${SITE_URL}/blogs/minimalist-writing`,
  },
  { title: 'The Future of Agentic Coding', url: `${SITE_URL}/blogs/agentic-coding` },
  { title: 'Designing for the Long Term', url: `${SITE_URL}/blogs/designing-long-term` },
]

export const NewsletterTemplate = ({
  blogTitle = "You can't build everything at once.",
  blogUrl = SITE_URL,
  unsubscribeToken = 'preview-token',
  blogExcerpt = 'Thinking about how we can build more focused, minimalist experiences, and why the constraints usually turn out to be the interesting part.',
  blogDate = '2026-06-18',
  readingTime = 5,
  previousPosts = defaultPosts,
}: NewsletterTemplateProps) => {
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`
  const postMeta = [
    formatEmailDate(blogDate),
    readingTime > 0 ? `${readingTime} min read` : undefined,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <EmailShell preview={blogExcerpt || blogTitle}>
      <Section className="e-opener" style={emailLayout.opener}>
        <Text style={emailLayout.meta}>{postMeta}</Text>
        <Heading as="h1" className="e-headline" style={emailLayout.headline}>
          {blogTitle}
        </Heading>
      </Section>

      <Section className="e-body" style={emailLayout.bodySection}>
        <EmailSignature text={`${FIRST_NAME} here.`} />

        <Text style={emailLayout.body}>{blogExcerpt}</Text>

        <Text style={emailLayout.body}>
          I wrote this one slowly, which is{' '}
          <span style={emailLayout.emphasis}>the only way I seem to write</span> anything worth
          sending. It is up on the site now, and if it saves you an afternoon then it has more than
          paid for itself.
        </Text>

        <Text style={emailLayout.linkLine}>
          <Link href={blogUrl} style={emailLayout.link}>
            Read the full post &rsaquo;
          </Link>
        </Text>
      </Section>

      {previousPosts.length > 0 && (
        <Section className="e-list" style={emailLayout.listSection}>
          <Text style={emailLayout.sectionLabel}>More from the blog</Text>

          {previousPosts.map((post, index) => (
            <Row
              key={post.url}
              style={
                index === previousPosts.length - 1 ? emailLayout.listRowLast : emailLayout.listRow
              }
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
                <Link href={post.url} style={emailLayout.link}>
                  {post.title} &rsaquo;
                </Link>
              </Column>
            </Row>
          ))}
        </Section>
      )}

      <EmailDissolve />
      <EmailSubscriberFooter unsubscribeUrl={unsubscribeUrl} />
      <EmailWordmark />
    </EmailShell>
  )
}
