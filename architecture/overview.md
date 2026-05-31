# System Overview

This covers how the site runs, handles data, and manages SEO.

## Hosting & Edge
- The site runs on Vercel.
- API routes (like /api/og for generating preview images) run on Vercel's Edge network so they load faster globally.
- Pages like blog posts are built ahead of time during deployment (generateStaticParams), making them load instantly for users.

## Database & Views
- We use a serverless Postgres database from Neon.
- We use Drizzle ORM to talk to the database safely with TypeScript.
- **View Counter**: Instead of updating the database every time someone views a page, we group multiple views together into one API call to save resources. The UI updates immediately before the database even finishes saving.

## SEO (Search Engine Optimization)
- **Open Graph Images**: Social media preview images are generated dynamically from code, not static image files.
- **Structured Data (JSON-LD)**: The site automatically generates schema.org data for search engines so they understand our content better (like marking up blog posts and breadcrumbs).
