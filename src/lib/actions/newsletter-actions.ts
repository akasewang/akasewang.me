'use server'

import { render } from '@react-email/components'
import { eq } from 'drizzle-orm'
import React from 'react'
import { NewsletterTemplate } from '@/components/emails/newsletter-template'
import { FULL_NAME, READING_SPEED, SITE_URL } from '@/constants/constants'
import { logContent } from '@/data/content/log-content'
import { toastContent } from '@/data/content/toast-content'
import { hasAdminSession } from '@/lib/admin-session'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { getAllBlogPosts, getBlogPost } from '@/lib/managers/blog-manager'
import { getNewsletterSender, getResend } from '@/lib/resend'
import type { ActionResult } from '@/types/actions'

/** The provider's ceiling for one batch call */
const BATCH_SIZE = 100
/** Its rate limit is two requests a second, so calls are held just over half a second apart */
const BATCH_INTERVAL_MS = 550

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Sends one blog post to every active subscriber. The template is rendered once with a placeholder
 * token and the per person unsubscribe link is substituted in, so a large list costs one render
 * rather than one each.
 */
export async function broadcastNewsletter(
  blogSlug: string,
): Promise<ActionResult<{ count: number }>> {
  const toasts = toastContent.newsletter

  if (!(await hasAdminSession())) {
    return { success: false, error: toasts.unauthorized }
  }

  const sender = getNewsletterSender()
  if (!sender) {
    return { success: false, error: toasts.otpSenderUnavailable }
  }

  const fromAddress = sender.includes('<') ? sender : `${FULL_NAME} <${sender}>`

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

    const resend = getResend()
    const total = activeSubscribers.length
    let sent = 0

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = activeSubscribers.slice(i, i + BATCH_SIZE)

      /**
       * Built per batch. Every payload carries its own copy of the rendered body, so building them
       * all up front would hold one full copy of the email per subscriber before any are sent.
       */
      const payloads = batch.map((s) => ({
        from: fromAddress,
        to: s.email,
        subject: targetPost.title,
        /**
         * replaceAll, not replace: a string pattern given to replace takes only the first hit, so a
         * second unsubscribe link would ship the placeholder itself as literal text.
         */
        html: baseHtmlContent.replaceAll('{{UNSUBSCRIBE_TOKEN}}', s.token),
      }))

      const { error } = await resend.batch.send(payloads)

      /**
       * Reported rather than thrown, because the batches before this one have already gone out and
       * a bare failure would leave the sender with no idea how far it got.
       */
      if (error) {
        console.error(logContent.newsletter.broadcastError, error.message)
        return { success: false, error: toasts.partialBroadcast(sent, total) }
      }

      sent += batch.length

      /** Resend allows two requests a second and a batch is one request, so the loop paces itself */
      if (sent < total) await sleep(BATCH_INTERVAL_MS)
    }

    return { success: true, data: { count: sent } }
  } catch (err) {
    console.error(logContent.newsletter.broadcastError, err instanceof Error ? err.message : err)
    return { success: false, error: toasts.broadcastError }
  }
}
