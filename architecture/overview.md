# System Overview

A high level look at how the site runs, handles data and manages SEO.

## Hosting & Edge

- The site runs on Vercel.
- API routes (such as `/api/og`, which generates social preview images) run on Vercel's Edge network so they respond quickly worldwide.
- Content pages like blog posts are prerendered at deploy time via `generateStaticParams`, so they load instantly for visitors.

## Database & Views

- Data lives in a serverless Postgres database from Neon.
- We query it through Drizzle ORM for end to end type safety.
- **View Counter**: Rather than writing to the database on every page view, we batch multiple views into a single API call. The UI updates optimistically, before the write even completes.

## SEO

- **Open Graph Images**: Social previews are generated dynamically from code instead of static image files.
- **Structured Data (JSON-LD)**: The site emits schema.org markup (for blog posts, breadcrumbs and more) so search engines understand the content.
