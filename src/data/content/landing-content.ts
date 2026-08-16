import { FIRST_NAME, LAST_NAME, ROLES } from '@/constants/constants'
import { ecosystemSites } from '@/data/static/ecosystem'
import type { LandingPageContent } from '@/types/home'
import type { SharedContent } from '@/types/site'

/**
 * The two sites reached from this page, taken from the list the links page and the menu also read.
 *
 * Looked up by label rather than by position, so reordering that list cannot silently swap which
 * one the profile picture leads to. A name that finds nothing falls back to the links page, which
 * lists every site anyway: one of these is written into a sentence, where a missing address would
 * otherwise reach the page as the word undefined.
 */
const ecosystemHref = (label: string) =>
  ecosystemSites.find((site) => site.label === label)?.href ?? '/links'

const componentsHref = ecosystemHref('Components')
const designHref = ecosystemHref('Design')

/** Every string and list the landing page renders, section by section */
export const landingPageContent: LandingPageContent = {
  hero: {
    firstName: FIRST_NAME,
    lastName: LAST_NAME,
    role: ROLES[0],
    roles: ROLES,
    aboutTitle: 'about me.',
    about: [
      `Hey there! I'm an engineer and designer who likes to [build applications](/projects) that make everyday things a little easier for me and the people around me and design [reusable components](${componentsHref}) for the joy of making things.`,
      "When I'm not building, I [write about](/blogs) what I'm working on or figuring out along the way and send the occasional email update to [subscribers](#newsletter) who like to follow along.",
      'Away from the keyboard, I enjoy [taking photos](/photos), playing games and keeping a [catalog](/catalog) of the anime and movies I watch.',
    ],
    findMeOn: 'Find me on',
    connectText: 'Interested in working together? Feel free to book a meeting!',
    scheduleMeet: 'book a meeting',
    messageBoard: 'write me a message',
    mailMeAt: 'or mail me at',
    scheduleMeetUrl: 'https://cal.com/akasewang',
    designsLabel: 'Click for designs •',
    designsUrl: designHref,
  },
  sections: {
    experience: 'experience.',
    technicalTraining: 'technical training.',
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

/** Strings reused across sections, such as the labels on a show more toggle */
export const sharedContent: SharedContent = {
  more: 'show more',
  less: 'show less',
}
