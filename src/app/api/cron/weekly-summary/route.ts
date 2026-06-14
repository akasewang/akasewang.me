import { NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { render } from '@react-email/components'
import { WeeklySummaryTemplate } from '@/components/emails/weekly-summary-template'
import React from 'react'
import { getResend, SENDER_EMAIL } from '@/lib/resend'

/** Recipient for the weekly summary (the site admin); the route 500s if it's unset. */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

/**
 * Scheduled cron job route that executes weekly to aggregate and report new newsletter subscribers.
 * This route must be called with a Bearer token matching `CRON_SECRET` for authorization.
 * If new subscribers exist, it renders a React Email template and sends it to the admin.
 *
 * @param request - The incoming HTTP request containing the authorization header.
 * @returns A JSON response indicating the execution status and subscriber count.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  /** Reject when the secret is unset so an empty secret cannot be matched, or when the token differs. */
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Missing ADMIN_EMAIL environment variable' }, { status: 500 })
  }

  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentSubscribers = await db.query.newsletterSubscribers.findMany({
      where: gte(newsletterSubscribers.createdAt, oneWeekAgo),
      columns: { email: true },
    })

    const count = recentSubscribers.length

    if (count === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No new subscribers this week.',
      })
    }

    const emails = recentSubscribers.map((s) => s.email)

    const htmlContent = await render(
      React.createElement(WeeklySummaryTemplate, {
        subscriberCount: count,
        newEmails: emails,
      }),
    )

    const { error } = await getResend().emails.send({
      from: `Weekly Cron <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Weekly Subscriber Summary - ${count} new!`,
      html: htmlContent,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('Cron error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    )
  }
}
