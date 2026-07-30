'use server'

import { render } from '@react-email/components'
import { eq } from 'drizzle-orm'
import React from 'react'
import { NewsletterTemplate } from '@/components/emails/newsletter-template'
import { FULL_NAME, READING_SPEED, SITE_URL } from '@/constants/constants'
import { logContent } from '@/data/content/log-content'
import { toastContent } from '@/data/content/toast-content'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { getAllBlogPosts, getBlogPost } from '@/lib/managers/blog-manager'
import { getResend, SENDER_EMAIL } from '@/lib/resend'
import type { ActionResult } from '@/types/actions'

/**
 * Sends one blog post to every active subscriber. The template is rendered once with a placeholder
 * token and the per person unsubscribe link is substituted in, so a large list costs one render
 * rather than one each. Sending goes out in batches of a hundred, the provider's limit per call.
 */
export async function broadcastNewsletter(
  blogSlug: string,
  adminSecret: string,
): Promise<ActionResult<{ count: number }>> {
  const toasts = toastContent.newsletter

  if (!process.env.ADMIN_PASSWORD || adminSecret !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: toasts.unauthorized }
  }

  try {
    const [posts, fullPost, activeSubscribers] = await Promise.all([
      getAllBlogPosts(),
      getBlogPost(blogSlug),
      db
        .select({
          email: newsletterSubscribers.email,
          token: newsletterSubscribers.token,
        })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isActive, true)),
    ])

    const targetPost = posts.find((p) => p.slug === blogSlug)
    if (!targetPost) return { success: false, error: toasts.postNotFound }

    if (!activeSubscribers.length) return { success: false, error: toasts.noSubscribers }

    /** A few recent posts for the footer, with the one being sent left out */
    const previousPosts = posts
      .filter((post) => post.slug !== blogSlug)
      .slice(0, 3)
      .map((post) => ({
        title: post.title,
        url: `${SITE_URL}/blogs/${post.slug}`,
      }))

    const wordCount = fullPost?.content?.trim().split(/\s+/).length || 0
    const readingTime = Math.max(1, Math.ceil(wordCount / READING_SPEED))

    const baseHtmlContent = await render(
      React.createElement(NewsletterTemplate, {
        blogTitle: targetPost.title,
        blogUrl: `${SITE_URL}/blogs/${blogSlug}`,
        unsubscribeToken: '{{UNSUBSCRIBE_TOKEN}}',
        blogExcerpt: targetPost.excerpt,
        blogDate: targetPost.date,
        readingTime: readingTime,
        previousPosts: previousPosts,
      }),
    )

    const payloads = activeSubscribers.map((s) => ({
      from: `${FULL_NAME} <${SENDER_EMAIL}>`,
      to: s.email,
      subject: targetPost.title,
      html: baseHtmlContent.replace('{{UNSUBSCRIBE_TOKEN}}', s.token),
    }))

    const resend = getResend()

    for (let i = 0; i < payloads.length; i += 100) {
      const { error } = await resend.batch.send(payloads.slice(i, i + 100))
      if (error) throw new Error(error.message)
    }

    return { success: true, data: { count: activeSubscribers.length } }
  } catch (err) {
    console.error(logContent.newsletter.broadcastError, err instanceof Error ? err.message : err)
    return { success: false, error: toasts.broadcastError }
  }
}
