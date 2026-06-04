import { FIRST_NAME, LAST_NAME, ROLES } from '@/constants/constants'
import type { LandingPageContent } from '@/types/home'
import type { SharedContent } from '@/types/site'

/**
 * Landing Page Content Model.
 * Centralized text for the home page — hero bio, section titles, and action labels —
 * so content can be updated without touching React component logic.
 */
export const landingPageContent: LandingPageContent = {
  hero: {
    firstName: FIRST_NAME,
    lastName: LAST_NAME,
    role: ROLES[0],
    roles: ROLES,
    aboutTitle: 'about me.',
    about: [
      "Hey there! I'm a data science grad and software engineer who likes to [build applications](/projects) that help myself and others be more productive and enjoy the process of creating.",
      'I also learned [UI UX design](https://noddy.studio/) to stay involved in building applications from start to finish, giving me a better understanding of the overall development process while occasionally building [reusable components](/components) to make my workflow more efficient.',
      "I write about what I'm working on or learning on my [blogs](/blogs), which you can [subscribe](/newsletter) for email updates. Outside of programming, I enjoy photography, playing games, and watching anime and movies. My [photos](/photos) and [catalog](/catalog) are there if you want to take a peek.",
    ],
    findMeOn: 'Find me on',
    connectText: 'Interested in working together? Feel free to schedule a meet!',
    scheduleMeet: 'schedule a meet',
    messageBoard: 'leave a message',
    mailMeAt: 'or mail me at',
    inactivePrefix: 'No longer active on',
    scheduleMeetUrl: 'https://cal.com/akasewang',
  },
  sections: {
    experience: 'experience.',
    volunteer: 'volunteer.',
    education: 'education.',
    certifications: 'certifications.',
    achievements: 'achievements.',
    bookmarks: 'bookmarks.',
    featuredProjects: {
      title: 'featured projects.',
      viewAll: 'view all projects',
    },
    featuredPosts: {
      title: 'featured posts.',
      viewAll: 'view all posts',
    },
    featuredComponents: {
      title: 'featured components.',
      viewAll: 'view all components',
    },
  },
}

/** Shared "show more / show less" toggle labels reused across expandable lists. */
export const sharedContent: SharedContent = {
  more: 'show more',
  less: 'show less',
}
