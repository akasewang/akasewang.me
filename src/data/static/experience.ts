import type { TimelineItemProps } from '@/types/site'

/** Roles held, newest first. An entry with no end date reads as the current one */
export const experiences: TimelineItemProps[] = [
  {
    id: 'manakin-studio-developer-designer',
    title: 'Independent Web Developer & Designer',
    startDate: '08.2025',
    description: [
      'Delivered production web applications for 8+ clients, owning requirements, UI/UX design, full stack implementation and deployment.',
      'Selected project specific technology stacks based on client requirements, adapting across front end, backend, database, CMS, payment and cloud deployment needs.',
      'Built responsive, SEO optimized interfaces focused on Core Web Vitals, accessibility, maintainability and conversion driven user flows.',
      'Developed REST APIs, authentication flows and database backed features for client portals, content platforms and business workflow automation.',
      'Integrated payment systems, CMS workflows and third party APIs so clients could manage content, transactions and operational data without developer support.',
    ],
    defaultExpanded: true,
    tech: [
      'Full Stack Development',
      'Frontend Architecture',
      'Backend Services',
      'Database Design',
      'Cloud Deployment',
      'API Integrations',
      'UI/UX Design',
    ],
    links: [{ text: 'Manakin Studio', url: 'https://www.manakin.studio', prefix: 'at' }],
  },
  {
    id: 'innovun-global-swe-trainee',
    title: 'Software Engineer Trainee',
    startDate: '05.2026',
    endDate: '08.2026',
    description: [
      'Developed a school admissions platform with Next.js, Drizzle ORM and Neon PostgreSQL to centralize enquiries, lead tracking and admissions data.',
      'Implemented role based dashboards, analytics charts and protected admin workflows for real time visibility into the admissions pipeline.',
      'Automated lead capture by connecting AJAX controllers with Google Apps Script and Google Sheets, reducing manual data entry for admission enquiries.',
      'Contributed to CRM delivery in an Agile team, supporting feature development, production deployment, third party integrations and issue resolution.',
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
