# akasewang.me

Source code for the personal portfolio, blog and digital footprint of Akash Dewangan. Built with a strict focus on performance, type safety and minimal latency.

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Biome](https://img.shields.io/badge/Biome-FFBD2E?style=for-the-badge&logo=biome&logoColor=black)](#)
[![Neon](https://img.shields.io/badge/Neon_Serverless-00E599?style=for-the-badge&logo=neon&logoColor=black)](#)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](#)

---

## Deep Dive Documentation

For a simple breakdown of how the systems in this portfolio work, check out the documentation:

- [**System Overview**](./architecture/overview.md) - Hosting, database and SEO.
- [**MDX & Content Parsing**](./architecture/mdx.md) - Reading local markdown files and swapping HTML for React.
- [**State & Hooks**](./architecture/state.md) - URL based filtering and custom React hooks.
- [**UI & Animations**](./architecture/ui.md) - Tailwind v4, custom cursors and Framer Motion effects.
- [**Audio Feedback Design System**](./architecture/audio-design-system.md) - Global audio preference, keyboard shortcuts and procedural UI sounds.
- [**Message Board**](./architecture/message-board.md) - Spam protection, rate limiting and admin commands.

---

## Features & How It Works

This portfolio is built to be fast, secure and easy to maintain.

### Hosting & SEO

- **Dynamic Images**: Social media preview images are generated from code automatically, so we don't need to manually create images for every new blog post.
- **Structured Data**: The site automatically adds data tags to help Google and other search engines understand the content.
- **Shareable Links**: When you filter or sort a list (like the blog), the URL updates. If you send that link to a friend, they see exactly what you see.

### Database & Tracking

- **Serverless Database**: Powered by Neon Postgres and queried safely using Drizzle ORM.
- **View Counter**: We track page views in batches. This keeps the site running fast because we don't hit the database for every single click.
- **Message Board**: A public guestbook with built in spam protection and rate limiting to block bots.

### Content & Components

- **Markdown (MDX)**: All blogs and projects are written in Markdown. We read these files locally and swap standard HTML for custom React components: styled links, tables, callouts, steps, tabs and zoomable images all render through our own components.
- **Weekly Emails**: An automated cron job sends the site admin a weekly summary of new newsletter subscribers.

### Styling & Standards

- **Fast Animations**: We use Framer Motion for smooth physics based animations and load the animation code lazily so the page doesn't feel heavy.
- **Tailwind v4**: The design system uses Tailwind CSS v4 and native CSS variables, including a custom mouse cursor that runs purely on fast CSS.
- **Clean Code Docs**: Our internal code comments strictly explain _how_ things work and never mention styling or colors. This keeps the documentation relevant even if the design changes later.
- **Formatter**: We use Biome instead of Prettier/ESLint because it is incredibly fast. A pre-commit hook (`.githooks/pre-commit`, enabled automatically on `npm install`) formats staged files before every commit.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Database**: Neon Postgres
- **ORM**: Drizzle ORM
- **Email Service**: Resend + React Email
- **Tooling**: Biome

## Local Setup

Requirements: Node.js >= 20, npm.

1. **Clone and Install**

   ```bash
   git clone https://github.com/akasewang/akasewang.me.git
   cd akasewang.me
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and provide your Neon connection string and Resend API keys.

3. **Database Migration**
   Synchronize the Drizzle schema with your Neon instance.

   ```bash
   npm run db:push
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

## License

This project is licensed under the CC-BY-NC-SA-4.0 License. You are free to explore and learn from this source code, but commercial use is prohibited and you must heavily modify the branding, content and personal assets before deploying your own iteration.

---

## A Note on the Docs

The documentation comments across this codebase were generated with AI so some may be inaccurate. If you spot an error feel free to mail me at [hi@akasewang.me](mailto:hi@akasewang.me).
