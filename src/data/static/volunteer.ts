import type { TimelineItemProps } from '@/types/site'

/**
 * Volunteer Data Dictionary.
 * Centralized static configuration and text definitions.
 */
export const volunteer: TimelineItemProps[] = [
  {
    id: 'independent-technical-researcher',
    title: 'Independent Technical Researcher',
    startDate: '01.2024',
    description: [
      'Built experimental full-stack apps to research and benchmark the performance limits of Next.js edge computing and Serverless PostgreSQL.',
      'Developed custom backend microservices and database schemas using Node.js and TypeScript for self-directed engineering challenges.',
      'Explored and documented advanced caching and request batching techniques to optimize API response times and database loads.',
      'Built proof-of-concept frontends to test complex URL-based state synchronization and strict React closure patterns.',
    ],
    defaultExpanded: true,
    tech: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
    links: [{ text: 'GitHub', url: 'https://github.com/akasewang', prefix: 'via' }],
  },
]
