import type { TimelineItemProps } from '@/types/site'

/** Schools and degrees, newest first, drawn as a timeline on the landing page */
export const education: TimelineItemProps[] = [
  {
    id: 'bachelor-of-technology-in-data-science',
    title: 'Bachelor of Technology in Data Science',
    startDate: '11.2021',
    endDate: '06.2025',
    description: [
      'CPI (CSVTU - Absolute Grading System): 7.2',
      'Relevant Coursework:',
      '- Computer Science: Data Structures and Algorithms, Object Oriented Programming, Operating Systems, Database Management Systems, Computer Networks, Computer Architecture, Design and Analysis of Algorithms.',
      '- Mathematics: Linear Algebra, Probability and Statistics, Calculus, Complex Analysis, Differential Equations, Numerical Methods, Discrete Mathematics, Graph Theory, Matrix Theory.',
    ],
    tech: [
      'Machine Learning',
      'Software Engineering',
      'Computer Engineering',
      'Applied Mathematics',
    ],
    links: [
      {
        text: 'Bhilai Institute of Technology, Durg',
        url: 'https://bitdurg.ac.in',
        prefix: 'at',
      },
    ],
  },
  {
    id: 'general-k-12-education',
    title: 'General [K-12] Education',
    startDate: '04.2007',
    endDate: '07.2021',
    description: [
      'Class XII (PCM with Computer Science): 93%',
      'Class X (Third Language: Sanskrit): 87.6%',
    ],
    tech: ['English', 'Hindi', 'Maths', 'Physics', 'Chemistry', 'Computer Science'],
    links: [
      {
        text: 'Delhi Public School, Bhilai',
        url: 'https://dpsbhilai.in/index.php',
        prefix: 'at',
      },
    ],
  },
]
