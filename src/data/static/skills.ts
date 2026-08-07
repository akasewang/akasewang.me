import type { SkillRows } from '@/types/home'

/** The skills grid, split into two rows so each can scroll in its own direction */
export const skillRows: SkillRows = {
  firstRow: [
    {
      id: 'ts',
      name: 'TypeScript',
      icon: '/skill-icons/typescript.svg',
      url: 'https://www.typescriptlang.org',
      category: 'frontend',
    },
    {
      id: 'js',
      name: 'JavaScript',
      icon: '/skill-icons/javascript.svg',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      category: 'frontend',
    },

    {
      id: 'react',
      name: 'React',
      icon: '/skill-icons/react.svg',
      url: 'https://react.dev',
      category: 'frontend',
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      icon: '/skill-icons/nextjs.svg',
      url: 'https://nextjs.org',
      category: 'frontend',
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      icon: '/skill-icons/tailwind.svg',
      url: 'https://tailwindcss.com',
      category: 'frontend',
    },
    {
      id: 'shadcn',
      name: 'shadcn/ui',
      icon: '/skill-icons/shadcn.svg',
      url: 'https://ui.shadcn.com',
      category: 'frontend',
    },
    {
      id: 'mui',
      name: 'Material UI',
      icon: '/skill-icons/mui.svg',
      url: 'https://mui.com',
      category: 'frontend',
    },

    {
      id: 'framer',
      name: 'Framer Motion',
      icon: '/skill-icons/framer.svg',
      url: 'https://www.framer.com/motion',
      category: 'frontend',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      icon: '/skill-icons/nodejs.svg',
      url: 'https://nodejs.org',
      category: 'backend',
    },
    {
      id: 'express',
      name: 'Express',
      icon: '/skill-icons/expressjs.svg',
      url: 'https://expressjs.com',
      category: 'backend',
    },
    {
      id: 'python',
      name: 'Python',
      icon: '/skill-icons/python.svg',
      url: 'https://www.python.org',
      category: 'languages',
    },
    {
      id: 'django',
      name: 'Django',
      icon: '/skill-icons/django.svg',
      url: 'https://www.djangoproject.com',
      category: 'backend',
    },
    {
      id: 'flask',
      name: 'Flask',
      icon: '/skill-icons/flask.svg',
      url: 'https://flask.palletsprojects.com',
      category: 'backend',
    },
  ],
  secondRow: [
    {
      id: 'fastapi',
      name: 'FastAPI',
      icon: '/skill-icons/fastapi.svg',
      url: 'https://fastapi.tiangolo.com',
      category: 'backend',
    },
    {
      id: 'prisma',
      name: 'Prisma',
      icon: '/skill-icons/prisma.svg',
      url: 'https://www.prisma.io',
      category: 'backend',
    },

    {
      id: 'postgresql',
      name: 'PostgreSQL',
      icon: '/skill-icons/postgresql.svg',
      url: 'https://www.postgresql.org',
      category: 'backend',
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: '/skill-icons/mongodb.svg',
      url: 'https://www.mongodb.com',
      category: 'backend',
    },
    {
      id: 'mysql',
      name: 'MySQL',
      icon: '/skill-icons/mysql.svg',
      url: 'https://www.mysql.com',
      category: 'backend',
    },

    {
      id: 'git',
      name: 'Git',
      icon: '/skill-icons/git.svg',
      url: 'https://git-scm.com',
      category: 'tools',
    },

    {
      id: 'figma',
      name: 'Figma',
      icon: '/skill-icons/figma.svg',
      url: 'https://www.figma.com',
      category: 'tools',
    },
    {
      id: 'postman',
      name: 'Postman',
      icon: '/skill-icons/postman.svg',
      url: 'https://www.postman.com',
      category: 'tools',
    },
    {
      id: 'aws',
      name: 'AWS',
      icon: '/skill-icons/aws.svg',
      url: 'https://aws.amazon.com',
      category: 'devops',
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: '/skill-icons/docker.svg',
      url: 'https://www.docker.com',
      category: 'devops',
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      icon: '/skill-icons/kubernetes.svg',
      url: 'https://kubernetes.io',
      category: 'devops',
    },

    {
      id: 'cpp',
      name: 'C++',
      icon: '/skill-icons/cpp.svg',
      url: 'https://isocpp.org',
      category: 'languages',
    },
  ],
}
