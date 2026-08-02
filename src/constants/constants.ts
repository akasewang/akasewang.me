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

/**
 * How long an admin code is. Both forms tell a code apart from an address by this, and the server
 * refuses anything that is not this shape, so it lives here rather than being written out at each
 * of the three and left to disagree the day it changes.
 */
export const ADMIN_CODE_LENGTH = 8

/**
 * Letters, digits and a few marks, with the ambiguous glyphs left out: no I, L or O beside 1 and 0,
 * because this is read off an email and typed back by hand and those are what get mistyped.
 *
 * Neither @ nor a full stop is in it. That is what keeps a code and an address impossible to read
 * as one another, which the message board relies on to tell which of the two has been entered.
 */
export const ADMIN_CODE_ALPHABET =
  'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!#$%&*+-=?'

/** Inside a character class only these carry meaning, so only these need escaping */
const escapeForCharClass = (value: string) => value.replace(/[\\\]^-]/g, '\\$&')

export const ADMIN_CODE_SHAPE = new RegExp(
  `^[${escapeForCharClass(ADMIN_CODE_ALPHABET)}]{${ADMIN_CODE_LENGTH}}$`,
)

/** Everything the alphabet does not hold, for filtering the field as it is typed */
export const ADMIN_CODE_STRIP = new RegExp(`[^${escapeForCharClass(ADMIN_CODE_ALPHABET)}]`, 'g')

/**
 * username@domain.extension, and nothing looser. The shape it replaced asked only for an @ and a
 * dot somewhere after it, which let through a domain of a single hyphen, a doubled dot, digits in
 * the extension and any trailing punctuation at all.
 *
 * Still a shape check rather than an RFC one: what an address really is gets settled by the mail
 * arriving, and a stricter reading of the standard would turn away addresses that genuinely work.
 */
export const EMAIL_SHAPE =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/

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
