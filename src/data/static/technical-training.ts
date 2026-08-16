import type { TimelineItemProps } from '@/types/site'

/** Courses and training, newest first, as timeline entries on the landing page */
export const technicalTraining: TimelineItemProps[] = [
  {
    id: 'python-full-stack-training-qspiders',
    title: 'Python Full Stack Developer Training',
    startDate: '7.2025',
    endDate: '8.2026',
    links: [{ text: 'QSpiders (Marathahalli)', url: 'https://qspiders.com/', prefix: 'at' }],
    description: [
      'Gained comprehensive expertise in core and advanced Python programming, mastering object oriented concepts, functional programming and data structures.',
      'Developed and deployed robust backend systems using the Django framework, implementing RESTful APIs, secure authentication and optimized SQL database integrations.',
      'Built dynamic, responsive user interfaces leveraging modern frontend technologies including HTML5, CSS3 and JavaScript, while utilizing Git for version control in agile environments.',
    ],
    defaultExpanded: true,
    tech: ['Python', 'JavaScript', 'Django', 'SQL'],
  },
]
