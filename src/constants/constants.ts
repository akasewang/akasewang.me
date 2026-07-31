export const SITE_URL = 'https://www.akasewang.me'

export const FIRST_NAME = 'Akash'

export const LAST_NAME = 'Dewangan'

export const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`

export const SITE_NAME = `${FULL_NAME} Portfolio`

export const USERNAME = 'akasewang'

export const SITE = 'akasewang.me'

export const EMAIL = 'hi@akasewang.me'

export const SITE_DESCRIPTION =
  "A personal archive of what I'm building and consuming. Featuring software projects, technical writing, a media catalog and personal essays."

/** Words per minute, the basis for every reading estimate */
export const READING_SPEED = 200

export const TWO_WEEKS_MS = 1209600000

/** Marks an entry that is still ongoing. parseAnyDate returns null for it, there being no date */
export const PRESENT = 'Present'

export const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy'

export const LONG_DATE_DISPLAY_FORMAT = 'd MMMM yyyy'

/**
 * Tried in order by parseAnyDate before the native parser, so this order is what settles an
 * ambiguous string. Day first forms come first, since that is how the content files are written.
 */
export const DATE_PARSING_PATTERNS = [
  'dd.MM.yyyy',
  'd.M.yyyy',
  'dd MMM yyyy',
  'd MMM yyyy',
  'MMM yyyy',
  'MM.yyyy',
  'yyyy-MM-dd',
  'dd-MM-yyyy',
  'MM/dd/yyyy',
  'MMMM yyyy',
]

export const MESSAGES_PER_PAGE = 20

export const CORE_TECHS = ['TypeScript', 'Python', 'SQL', 'PostgreSQL']

export const SECONDARY_TECHS = ['Next.js', 'AWS', 'Prisma']

export const ROLES = ['Software Engineer', 'Design Engineer', 'Open Source Contributor']

export const ALL_KEYWORDS = [
  FULL_NAME,
  FIRST_NAME,
  LAST_NAME,
  USERNAME,
  ...ROLES,
  ...CORE_TECHS,
  ...SECONDARY_TECHS,
  'Developer Portfolio',
]

/** The first letter of each word, for capitalising a supplied name */
export const CAPITALIZE_REGEX = /\b\w/g

/**
 * formatDateString matches a written date against these four to keep its precision, so a year stays
 * a year rather than being padded with a month and day nobody supplied.
 */
export const YEAR_REGEX = /^\d{4}$/

export const MONTH_YEAR_REGEX = /^\d{1,2}\.\d{4}$/

export const FULL_DATE_REGEX = /^\d{1,2}\.\d{1,2}\.\d{4}$/

export const TEXT_MONTH_YEAR_REGEX =
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}$/i

/** Global, so anything reusing it must clone it rather than inherit its lastIndex */
export const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

/** Geometry for the scroll progress ring, which draws its arc from the circumference */
export const BACK_TO_TOP_SIZE = 58

export const BACK_TO_TOP_CENTER = BACK_TO_TOP_SIZE / 2

export const BACK_TO_TOP_RADIUS = 26.5

export const BACK_TO_TOP_CIRCUMFERENCE = 2 * Math.PI * BACK_TO_TOP_RADIUS
