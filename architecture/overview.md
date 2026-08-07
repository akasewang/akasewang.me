# System Overview

A high level look at how the site runs, handles data and manages SEO.

## Hosting & Edge

- The site runs on Vercel, built with the Next.js App Router (React Server Components by default).
- `/api/og`, which generates social preview images, runs on the Edge runtime so it responds close to the visitor worldwide.
- Content pages like blog posts and projects are prerendered at build time via `generateStaticParams`, so they ship as static HTML and load instantly.
- Routes that depend on live external data use Incremental Static Regeneration: they serve a cached static page and rebuild it in the background on a `revalidate` interval (e.g. `/changelog` and `/api/github-stars` at 3600s).

## Database & Views

- Data lives in a serverless Postgres database from Neon, queried through Drizzle ORM for end to end type safety.
- The schema has six tables with separate responsibilities:
  - `views` stores one aggregate counter per content slug.
  - `newsletter_subscribers` stores normalized email addresses, stable unsubscribe UUIDs, active
    state and the current subscription date.
  - `message_board` stores public messages and optional admin replies.
  - `admin_otp` stores the current short-lived admin-code hash, expiry and failed-attempt count.
  - `admin_session` stores hashes and expiries for revocable browser sessions.
  - `action_rate_limit` stores expiring HMAC keys for public-action cooldowns.
- Subscriber and message rows do not contain IP addresses. The only IP-derived value retained is the
  pseudonymous, action-scoped HMAC key in `action_rate_limit` until its expired row is cleaned up.
- **View Counter** (`src/lib/actions/views.ts`, Server Actions):
  - Increments are a single atomic Postgres upsert (`INSERT ... ON CONFLICT DO UPDATE SET count = count + 1`), so concurrent views never race.
  - A `sessionStorage` key (`viewed-<slug>`) plus an in-memory guard caps it at one successful
    increment per browser-tab session; later mounts request the stored count.
  - Lists batch their reads: `ViewsProvider` coalesces `prefetchViews` calls within a 50 ms window
    into one `getViewsBatchAction` (`WHERE slug IN (...)`) and caches the result in `localStorage`
    for five minutes. Incremented counts update from the value returned by the database.
  - **Visits**: a project that carries an `external` link has no page here to be viewed, so its card
    counts being opened instead, recorded by the card itself through `recordVisit` when it is
    followed. The tally is kept in the same table under a `visit:` prefixed key, which cannot
    collide with a page view: a content slug is validated against `[a-z0-9][a-z0-9_-]*` and can
    never contain a colon. Everything else is shared unchanged, including the once per session
    guard, so opening a project twice in a session counts once.
  - `countKeyFor` decides which of the two a given item uses, and is the single rule the counter,
    the listing prefetch and sorting by count all read. Deriving it separately in any of them would
    let a card show one number while the sort ordered by another.

## Public Action Cooldowns

- Newsletter signup has a 60-second cooldown; public message posting has a 120-second cooldown.
- Both clients persist the matching deadline in local storage for consistent feedback across
  reloads and tabs. This is UX only; the server remains authoritative.
- The server HMACs the action and forwarded client IP with `RATE_LIMIT_SECRET`, then atomically
  inserts or advances that key in `action_rate_limit`. Concurrent serverless requests cannot both
  claim the same active window, and raw IP addresses are not stored.
- Rate-limited responses include the remaining seconds so the button reflects the database deadline
  instead of starting a new hardcoded interval.
- The weekly summary job deletes expired cooldown rows, keeping the table bounded.

Generate an independent secret for cooldown keys:

```bash
node -e "console.log('RATE_LIMIT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

## Scheduled Newsletter Summary

- Vercel invokes `/api/cron/weekly-summary` every Sunday at `09:00 UTC`, as declared in
  `vercel.json`.
- The route requires `Authorization: Bearer <CRON_SECRET>`, selects active addresses created or
  reactivated during the previous seven days, cleans expired cooldown rows and sends the summary
  through Resend.
- Vercel does not create the secret. Generate it separately from `RATE_LIMIT_SECRET`:

```bash
node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Configure both secrets in local `.env` and in Vercel, then redeploy after adding or rotating them.
Run `npm run db:push` whenever the Drizzle schema changes, including before deploying the admin and
cooldown tables for the first time.

## Admin Authentication

- Admin access uses an emailed eight-character code instead of a password or command prefix. The
  recipient is `RESEND_ADMIN_EMAIL`, sent from `RESEND_OTP_EMAIL`.
- The database keeps the code's hash, ten-minute expiry and failed-attempt count. A successful code
  exchange creates a random session token in an httpOnly, same-site cookie; only the token hash and
  one-hour expiry are stored.
- Message moderation and newsletter broadcasts validate that revocable session independently for
  every privileged Server Action. See [Newsletter & Admin Access](newsletter.md) for the complete
  flow.

## GitHub Integration

- The navbar star count and `/changelog` both read the repository through one server side helper, `fetchGithub` (`src/lib/github.ts`).
- The optional `GITHUB_TOKEN` is attached server side only to raise the API rate limit. On a `401`/`403` the helper retries anonymously, so an expired or mis-scoped token degrades to public access instead of failing.
- The browser never calls GitHub directly: the star count proxies through `/api/github-stars` so the token stays on the server. The changelog fetches the commit list in a Server Component (`changelog-manager.ts`), groups it by calendar day and is ISR cached hourly.

## SEO

- **Open Graph Images**: Social previews are generated dynamically from code (`/api/og`, Edge runtime) instead of static image files.
- **Structured Data (JSON-LD)**: The site emits schema.org markup (blog posts, breadcrumbs and more) so search engines understand the content.
- **Sitemap & Feeds**: `/sitemap.xml` and `/feed.xml` are built from the same content managers that render the pages, so they stay in sync with what is published.
