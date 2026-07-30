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

## GitHub Integration

- The navbar star count and `/changelog` both read the repository through one server side helper, `fetchGithub` (`src/lib/github.ts`).
- The optional `GITHUB_TOKEN` is attached server side only to raise the API rate limit. On a `401`/`403` the helper retries anonymously, so an expired or mis-scoped token degrades to public access instead of failing.
- The browser never calls GitHub directly: the star count proxies through `/api/github-stars` so the token stays on the server. The changelog fetches the commit list in a Server Component (`changelog-manager.ts`), groups it by calendar day and is ISR cached hourly.

## SEO

- **Open Graph Images**: Social previews are generated dynamically from code (`/api/og`, Edge runtime) instead of static image files.
- **Structured Data (JSON-LD)**: The site emits schema.org markup (blog posts, breadcrumbs and more) so search engines understand the content.
- **Sitemap & Feeds**: `/sitemap.xml` and `/feed.xml` are built from the same content managers that render the pages, so they stay in sync with what is published.
