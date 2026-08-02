import { render } from '@react-email/components'
import { and, eq, gte, lt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import React from 'react'
import { WeeklySummaryTemplate } from '@/components/emails/weekly-summary-template'
import { db } from '@/lib/db/drizzle'
import { actionRateLimit, newsletterSubscribers } from '@/lib/db/schema'
import { getResend, SENDER_EMAIL } from '@/lib/resend'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

/**
 * Mails the week's new subscribers to the owner. Reachable on the public internet, so the bearer
 * secret is checked first and an unset secret refuses every caller rather than waving them through.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Missing ADMIN_EMAIL environment variable' }, { status: 500 })
  }

  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const [, recentSubscribers] = await Promise.all([
      /** Cooldown rows have no value after expiry; the weekly job keeps the table bounded */
      db.delete(actionRateLimit).where(lt(actionRateLimit.expiresAt, new Date())),
      db.query.newsletterSubscribers.findMany({
        where: and(
          eq(newsletterSubscribers.isActive, true),
          gte(newsletterSubscribers.createdAt, oneWeekAgo),
        ),
        columns: { email: true },
      }),
    ])

    const emails = recentSubscribers.map((s) => s.email)
    const count = emails.length

    /**
     * The addresses are the whole of what the template is told. It counts them itself, so the
     * heading it sets and the subject line below are read off one array rather than off a number
     * passed alongside it that nothing kept in step.
     */
    const htmlContent = await render(
      React.createElement(WeeklySummaryTemplate, {
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
