import { NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { newsletterSubscribers } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import { WeeklySummaryTemplate } from '@/components/emails/weekly-summary-template'
import React from 'react'

let resendInstance: Resend | null = null

/** Lazily instantiates a singleton Resend client, throwing if the API key is not configured. */
function getResend() {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

/** From address for outgoing mail, falling back to Resend's onboarding sender. */
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
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

  /** Verify that the request is authenticated by the Vercel cron scheduler */
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /** Ensure the admin email is configured before attempting to send the summary */
  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Missing ADMIN_EMAIL environment variable' }, { status: 500 })
  }

  try {
    /** Calculate the exact timestamp for 7 days prior to the current execution */
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    /** Query the database strictly for subscribers created within the last 7 days */
    const recentSubscribers = await db.query.newsletterSubscribers.findMany({
      where: gte(newsletterSubscribers.createdAt, oneWeekAgo),
      columns: { email: true },
    })

    const count = recentSubscribers.length

    /** Short circuit and exit early if there are no new subscribers to report */
    if (count === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No new subscribers this week.',
      })
    }

    const emails = recentSubscribers.map((s) => s.email)

    /** Compile the React Email component into an HTML string for the email client */
    const htmlContent = await render(
      React.createElement(WeeklySummaryTemplate, {
        subscriberCount: count,
        newEmails: emails,
      }),
    )

    /** Send the aggregated summary email to the admin via Resend */
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
