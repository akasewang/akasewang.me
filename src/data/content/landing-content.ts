import { FIRST_NAME, LAST_NAME, ROLES } from '@/constants/constants'
import type { LandingPageContent } from '@/types/home'
import type { SharedContent } from '@/types/site'

/**
 * Landing Page Content Model.
 * Centralized text for the home page (hero bio, section titles and action labels)
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
      "Hey there! I'm a data science grad and software engineer who likes to [build applications](/projects) that help myself and others be more productive and [design reusable components](https://ui.noddy.studio/) to enjoy the process of creating.",
      "I [write about](/blogs) what I'm working on or learning and share occasional email updates with [subscribers](/newsletter).",
      'Outside of programming, I enjoy [taking photos](/photos), playing games and keeping a [catalog](/catalog) of the anime and movies I watch.',
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
  },
}

/** Shared "show more / show less" toggle labels reused across expandable lists. */
export const sharedContent: SharedContent = {
  more: 'show more',
  less: 'show less',
}
