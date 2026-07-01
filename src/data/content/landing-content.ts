import { FIRST_NAME, LAST_NAME, ROLES } from '@/constants/constants'
import type { LandingPageContent } from '@/types/home'
import type { SharedContent } from '@/types/site'

export const landingPageContent: LandingPageContent = {
  hero: {
    firstName: FIRST_NAME,
    lastName: LAST_NAME,
    role: ROLES[0],
    roles: ROLES,
    aboutTitle: 'about me.',
    about: [
      "Hey there! I'm a software engineer who likes to [build applications](/projects) that make everyday things a little easier for me and the people around me and design [reusable components](https://library.noddy.studio/) for the joy of making things.",
      "When I'm not building, I [write about](/blogs) what I'm working on or figuring out along the way and send the occasional email update to [subscribers](/newsletter) who like to follow along.",
      'Away from the keyboard, I enjoy [taking photos](/photos), playing games and keeping a [catalog](/catalog) of the anime and movies I watch.',
    ],
    findMeOn: 'Find me on',
    connectText: 'Interested in working together? Feel free to schedule a meet!',
    scheduleMeet: 'schedule a meet',
    messageBoard: 'leave a message',
    mailMeAt: 'or mail me at',
    inactivePrefix: 'No longer active on',
    scheduleMeetUrl: 'https://cal.com/akasewang',
    designsLabel: 'Click for designs •',
    designsUrl: 'https://noddy.studio/',
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

export const sharedContent: SharedContent = {
  more: 'show more',
  less: 'show less',
}
