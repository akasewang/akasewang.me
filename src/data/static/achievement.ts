import type { TimelineItemProps } from '@/types/site'

/**
 * Achievements Data Dictionary.
 * Centralized static configuration and text definitions.
 */
export const achievements: TimelineItemProps[] = [
  {
    id: 'mongodb-diamante-track-winner',
    title: 'MongoDB & Diamante Track Winner',
    startDate: '09.2024',
    description: [
      'Secured 1st Place (MongoDB Track) and 4th Place (Diamante Blockchain Track) out of 50+ competing teams.',
      'Built Pramanit, a decentralized app using Diamante Blockchain and MongoDB for secure certificate issuance, eliminating counterfeits and streamlining verification.',
    ],
    defaultExpanded: true,
    tech: ['React', 'Node.js', 'MongoDB', 'Diamante'],
    links: [
      { text: 'HTS', url: 'https://hackthespace.co/', prefix: 'by' },
      { text: 'Project', url: 'https://github.com/Pramanit/Pramanit' },
      {
        text: 'Certificate',
        url: 'https://drive.google.com/drive/folders/1pkI9P-ag5d1l0-XEo0-KTk7iF-ICjBbe?usp=sharing',
      },
    ],
  },
  {
    id: 'prime-minister-trophy-scholarship',
    title: 'Prime Minister Trophy Scholarship',
    startDate: '12.2022',
    endDate: '11.2025',
    description: [
      'Awarded to select SAIL wards for outstanding academic excellence in the Senior Secondary Examination (Class XII).',
    ],
    defaultExpanded: false,
    tech: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science'],
    links: [{ text: 'SAIL', url: 'https://sail.co.in/en', prefix: 'by' }],
  },
]
