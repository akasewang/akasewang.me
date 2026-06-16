import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { EmailHeader, emailFonts, emailStyles, emailTheme } from './email-template-shared'

interface NewsletterTemplateProps {
  unsubscribeToken?: string
  blogTitle?: string
  blogUrl?: string
  blogExcerpt?: string
  blogDate?: string | Date
  readingTime?: number
  previousPosts?: { title: string; url: string }[]
}

const styles = {
  ...emailStyles,
  headingLink: { color: emailTheme.text, textDecoration: 'none' },
  excerpt: {
    margin: '0 0 28px',
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
  postsSection: {
    borderTop: `1px dashed ${emailTheme.border}`,
    padding: '28px 32px',
  },
  postsLabel: {
    margin: '0 0 18px',
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    color: emailTheme.dim,
    lineHeight: '16px',
  },
  postRow: { marginBottom: '14px' },
  postIndexCol: { width: '32px', verticalAlign: 'top' as const },
  postIndex: {
    margin: 0,
    fontFamily: emailFonts.mono,
    fontSize: '11px',
    color: emailTheme.dim,
    lineHeight: '22px',
  },
  postLink: {
    fontFamily: emailFonts.sans,
    fontSize: '14px',
    color: emailTheme.text,
    textDecoration: 'none',
    lineHeight: '22px',
  },
}

const defaultPosts = [
  {
    title: 'Building a Minimalist Writing Environment',
    url: `${SITE_URL}/blogs/minimalist-writing`,
  },
  {
    title: 'The Future of Agentic Coding',
    url: `${SITE_URL}/blogs/agentic-coding`,
  },
  {
    title: 'Designing for the Long Term',
    url: `${SITE_URL}/blogs/designing-long-term`,
  },
]

export const NewsletterTemplate = ({
  blogTitle = `A new post from ${FULL_NAME}`,
  blogUrl = SITE_URL,
  unsubscribeToken = 'preview-token',
  blogExcerpt = 'Thinking about how we can build more focused, minimalist experiences for our users...',
  blogDate,
  readingTime = 5,
  previousPosts = defaultPosts,
}: NewsletterTemplateProps) => {
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>
        {blogExcerpt || blogTitle} {'​'.repeat(150)}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <EmailHeader date={blogDate} />

          <Section style={styles.mainSection}>
            <Text style={styles.eyebrow}>new post · {readingTime} min read</Text>
            <Heading as="h1" style={styles.heading}>
              <Link href={blogUrl} style={styles.headingLink}>
                {blogTitle}
              </Link>
            </Heading>
            {blogExcerpt && <Text style={styles.excerpt}>{blogExcerpt}</Text>}
            <Link href={blogUrl} style={styles.ctaLink}>
              read full post
            </Link>
          </Section>

          {previousPosts.length > 0 && (
            <Section style={styles.postsSection}>
              <Text style={styles.postsLabel}>previous posts</Text>
              {previousPosts.map((post, index) => (
                <Row key={index} style={styles.postRow}>
                  <Column style={styles.postIndexCol}>
                    <Text style={styles.postIndex}>{String(index + 1).padStart(2, '0')}</Text>
                  </Column>
                  <Column>
                    <Link href={post.url} style={styles.postLink}>
                      {post.title}
                    </Link>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

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
