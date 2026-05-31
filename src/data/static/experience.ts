import type { TimelineItemProps } from '@/types/site'

/**
 * Professional Experience Data Model.
 * Represents chronological work history, roles, and technical responsibilities.
 * Passed into the Timeline/ExpandableList components for rendering on the landing page.
 */
export const experiences: TimelineItemProps[] = [
  {
    id: 'noddy-founder',
    title: 'Independent Web Developer & Designer',
    startDate: '08.2025',
    description: [
      'Partnered with 8+ clients to deliver custom solutions ranging from dedicated UI/UX design to end-to-end full-stack development.',
      'Designed interfaces in Figma and built reusable frontend components, helping clients launch faster and reducing future development effort by 30%.',
      'Built secure backend systems using Next.js, PostgreSQL, and AWS capable of handling thousands of daily requests without downtime.',
      'Managed domain deployments, SEO optimization, and landing page redesigns, increasing client lead conversion rates by up to 25%.',
    ],
    defaultExpanded: true,
    tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'AWS', 'Figma', 'Framer'],
    links: [{ text: 'Noddy', url: 'https://noddy.studio', prefix: 'at' }],
  },
  {
    id: 'innovun-global-swe-trainee',
    title: 'Software Engineer Trainee',
    startDate: '05.2026',
    description: [
      'Provide ongoing technical consulting for SKEI Bangalore, troubleshooting system workflows, advising on software integrations, and resolving technical queries.',
      'Designed and developed a new website for SKEI Bangalore, including custom, role-based dashboards for their team and ours to track admission leads.',
      'Built an automated lead tracking system by integrating Ajax controllers with Google Apps Script to securely log admission data directly into Google Sheets.',
      'Assisted in the final development phases of an enterprise-level CRM system, helping the team successfully deploy the completed product.',
    ],
    defaultExpanded: true,
    tech: [
      'TypeScript',
      'Next.js',
      'Prisma',
      'Google Apps Script',
      'PostgreSQL',
      'AWS',
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
