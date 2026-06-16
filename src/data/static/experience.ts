import type { TimelineItemProps } from '@/types/site'

export const experiences: TimelineItemProps[] = [
  {
    id: 'noddy-studio-founder',
    title: 'Independent Web Developer & Designer',
    startDate: '08.2025',
    description: [
      'Delivered end to end web solutions for 8+ clients across the full SDLC, owning UI/UX design in Figma through full stack development, deployment and post launch maintenance.',
      'Architected secure REST APIs and backend services on Next.js, PostgreSQL and AWS, sustaining thousands of daily requests at 99.9% uptime with sub 200ms median response times.',
      'Optimized bundle size, caching and image delivery, cutting page load times by ~40% and lowering client hosting costs.',
      'Integrated third party services like Stripe payments, authentication and headless CMS tooling, giving clients self serve control over content and payments.',
      'Owned CI/CD deployments, technical SEO and landing page redesigns, lifting organic traffic and improving client lead conversion rates by up to 25%.',
    ],
    defaultExpanded: true,
    tech: [
      'TypeScript',
      'React',
      'Next.js',
      'Tailwind CSS',
      'PostgreSQL',
      'AWS',
      'Figma',
      'Framer',
    ],
    links: [{ text: 'Noddy Studio', url: 'https://noddy.studio', prefix: 'at' }],
  },
  {
    id: 'innovun-global-swe-trainee',
    title: 'Software Engineer Trainee',
    startDate: '05.2026',
    description: [
      'Provide ongoing technical consulting for SKEI Bangalore, troubleshooting system workflows, advising on third party integrations and resolving production issues to keep operations running smoothly.',
      'Built a dedicated [admissions microsite](https://skeischool.vercel.app/) on Next.js with Drizzle ORM and Neon PostgreSQL, adding role based dashboards and analytics charts for real time visibility into the lead pipeline.',
      'Engineered an automated lead capture pipeline integrating Ajax controllers with Google Apps Script, securely logging admission enquiries to Google Sheets in real time and eliminating manual data entry.',
      'Contributed to the final development and deployment of an enterprise grade CRM, collaborating in an Agile team to ship the product to production on schedule.',
    ],
    defaultExpanded: true,
    tech: [
      'TypeScript',
      'React',
      'Next.js',
      'Drizzle ORM',
      'Neon',
      'PostgreSQL',
      'Google Apps Script',
      'Vercel',
    ],
    links: [
      {
        text: 'Innovun Global',
        url: 'https://innovunglobal.com',
        prefix: 'at',
      },
    ],
  },
]
