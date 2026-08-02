# System Overview

A high level look at how the site runs, handles data and manages SEO.

## Hosting & Edge

- The site runs on Vercel, built with the Next.js App Router (React Server Components by default).
- `/api/og`, which generates social preview images, runs on the Edge runtime so it responds close to the visitor worldwide.
- Content pages like blog posts and projects are prerendered at build time via `generateStaticParams`, so they ship as static HTML and load instantly.
- Routes that depend on live external data use Incremental Static Regeneration: they serve a cached static page and rebuild it in the background on a `revalidate` interval (e.g. `/changelog` and `/api/github-stars` at 3600s).

## Database & Views

- Data lives in a serverless Postgres database from Neon, queried through Drizzle ORM for end to end type safety.
- **View Counter** (`src/lib/actions/views.ts`, Server Actions):
  - Increments are a single atomic Postgres upsert (`INSERT ... ON CONFLICT DO UPDATE SET count = count + 1`), so concurrent views never race.
  - A `sessionStorage` key (`viewed-<slug>`) plus an in-memory guard caps it at one successful
    increment per browser-tab session; later mounts request the stored count.
  - Lists batch their reads: `ViewsProvider` coalesces `prefetchViews` calls within a 50 ms window
    into one `getViewsBatchAction` (`WHERE slug IN (...)`) and caches the result in `localStorage`
    for five minutes. Incremented counts update from the value returned by the database.

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
- The route requires `Authorization: Bearer <CRON_SECRET>`, reads the week's active signups, cleans
  expired cooldown rows and sends the summary through Resend.
- Vercel does not create the secret. Generate it separately from `RATE_LIMIT_SECRET`:

```bash
node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Configure both secrets in local `.env` and in Vercel, then redeploy after adding or rotating them.

## GitHub Integration

- The navbar star count and `/changelog` both read the repository through one server side helper, `fetchGithub` (`src/lib/github.ts`).
- The optional `GITHUB_TOKEN` is attached server side only to raise the API rate limit. On a `401`/`403` the helper retries anonymously, so an expired or mis-scoped token degrades to public access instead of failing.
- The browser never calls GitHub directly: the star count proxies through `/api/github-stars` so the token stays on the server. The changelog fetches the commit list in a Server Component (`changelog-manager.ts`), groups it by calendar day and is ISR cached hourly.

## SEO

- **Open Graph Images**: Social previews are generated dynamically from code (`/api/og`, Edge runtime) instead of static image files.
- **Structured Data (JSON-LD)**: The site emits schema.org markup (blog posts, breadcrumbs and more) so search engines understand the content.
- **Sitemap & Feeds**: `/sitemap.xml` and `/feed.xml` are built from the same content managers that render the pages, so they stay in sync with what is published.
