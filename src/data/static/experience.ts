import type { TimelineItemProps } from '@/types/site'

/** Roles held, newest first. An entry with no end date reads as the current one */
export const experiences: TimelineItemProps[] = [
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
