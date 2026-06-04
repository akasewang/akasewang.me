'use server'

import React from 'react'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { Resend } from 'resend'
import { getAllBlogPosts, getBlogPost } from '@/lib/managers/blog-manager'
import { render } from '@react-email/components'
import { NewsletterTemplate } from '@/components/emails/newsletter-template'
import { eq } from 'drizzle-orm'
import { SITE_URL, FULL_NAME, READING_SPEED } from '@/constants/constants'
import { toastContent } from '@/data/content/toast-content'
import { logContent } from '@/data/content/log-content'
import type { ActionResult } from '@/types/actions'

let resendInstance: Resend | null = null

/** Lazily instantiates a singleton Resend client, throwing if the API key is not configured. */
function getResend() {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

/** From-address for outgoing mail, falling back to Resend's onboarding sender. */
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

/**
 * Secure admin server action that builds an HTML email template for a new blog post.
 * Broadcasts the email in batches via Resend to all active subscribers.
 *
 * @param blogSlug - The slug of the newly published blog post to feature.
 * @param adminSecret - The secret password to verify admin privileges.
 * @returns An ActionResult indicating success and the count of emails dispatched.
 */
export async function broadcastNewsletter(
  blogSlug: string,
  adminSecret: string,
): Promise<ActionResult<{ count: number }>> {
  const toasts = toastContent.newsletter

  /** Verify admin credentials immediately to prevent unauthorized broadcasts */
  if (!process.env.ADMIN_PASSWORD || adminSecret !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: toasts.unauthorized }
  }

  try {
    /** Run intensive data fetching queries in parallel to minimize latency */
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
    /** Abort if the requested post slug does not map to a real MDX document */
    if (!targetPost) return { success: false, error: toasts.postNotFound }

    /** Do not execute email generation logic if the subscriber list is empty */
    if (!activeSubscribers.length) return { success: false, error: toasts.noSubscribers }

    const previousPosts = posts
      .filter((post) => post.slug !== blogSlug)
      .slice(0, 3)
      .map((post) => ({
        title: post.title,
        url: `${SITE_URL}/blogs/${post.slug}`,
      }))

    /** Calculate a dynamic reading time for the newsletter based on actual word count */
    const wordCount = fullPost?.content?.trim().split(/\s+/).length || 0
    const readingTime = Math.max(1, Math.ceil(wordCount / READING_SPEED))

    /** Compile the React Email component into a raw HTML string for the email clients */
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

    /**
     * Map over every active subscriber and inject their unique unsubscribe token directly
     * into the pre-compiled HTML string, which is much faster than re-rendering per recipient.
     */
    const payloads = activeSubscribers.map((s) => ({
      from: `${FULL_NAME} <${SENDER_EMAIL}>`,
      to: s.email,
      subject: targetPost.title,
      html: baseHtmlContent.replace('{{UNSUBSCRIBE_TOKEN}}', s.token),
    }))

    const resend = getResend()

    /** Chunk payloads into batches of 100 to adhere to Resend API rate limits */
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
