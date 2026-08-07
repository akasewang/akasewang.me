/**
 * The canonical origin, www and all, that every absolute URL on the site is built from: the
 * metadata base, the breadcrumb trails and the ids in the structured data.
 */
export const SITE_URL = 'https://www.akasewang.me'

/** Kept apart from the surname because plenty of the copy uses one name on its own */
export const FIRST_NAME = 'Akash'

export const LAST_NAME = 'Dewangan'

/** The byline: the author on every page, the person in the structured data, the name in the emails */
export const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`

/** What the site calls itself in a share card or a search result */
export const SITE_NAME = `${FULL_NAME} Portfolio`

/**
 * The handle, which is the same on every platform. Each social link and the repo path are built
 * from it rather than written out one URL at a time.
 */
export const USERNAME = 'akasewang'

/** The bare domain, which doubles as the repository name in the links back to the source */
export const SITE = 'akasewang.me'

/** The public address, offered as a mailto in the hero */
export const EMAIL = 'hi@akasewang.me'

/** The site in a sentence, for the default meta description and the structured data */
export const SITE_DESCRIPTION =
  "A personal archive of what I'm building and consuming. Featuring software projects, technical writing, a media catalog and personal essays."

/** Words per minute, the basis for every reading estimate */
export const READING_SPEED = 200

/**
 * How many characters an admin code runs to. The generator draws exactly this many, the field stops
 * accepting input at it and the shape below is built from it, so the three cannot come to disagree.
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

/**
 * A string that is a code and nothing else. The admin form tests it to decide a code is worth
 * sending, the message board tests it to tell a code from an ordinary message and the server tests
 * it before touching the database, so a malformed one is turned away everywhere alike.
 */
export const ADMIN_CODE_SHAPE = new RegExp(
  `^[${escapeForCharClass(ADMIN_CODE_ALPHABET)}]{${ADMIN_CODE_LENGTH}}$`,
)

/** Everything the alphabet does not hold, for filtering the field as it is typed */
export const ADMIN_CODE_STRIP = new RegExp(`[^${escapeForCharClass(ADMIN_CODE_ALPHABET)}]`, 'g')

/**
 * username@domain.extension, and nothing looser: a domain that opens and closes on an alphanumeric,
 * no doubled dots, no digits in the extension and no punctuation trailing the end.
 *
 * Still a shape check rather than an RFC one: what an address really is gets settled by the mail
 * arriving, and a stricter reading of the standard would turn away addresses that genuinely work.
 */
export const EMAIL_SHAPE =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/

/** Marks an entry that is still ongoing. parseAnyDate returns null for it, there being no date */
export const PRESENT = 'Present'

/** The compact form a date is shown in wherever it is scanned rather than read */
export const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy'

/** The spelled out form, for the day headings the message board sets above each run of messages */
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

/**
 * How many messages a page of the board holds. The server falls back to it and clamps anything
 * larger, and the list reads a page shorter than this as having reached the bottom of the board.
 */
export const MESSAGES_PER_PAGE = 20

/**
 * What the site claims to know, in two tiers. The core is the everyday stack and the secondary is
 * what sits around it. Both go into the structured data and into the keyword list below.
 */
export const CORE_TECHS = ['TypeScript', 'Python', 'SQL', 'PostgreSQL']

export const SECONDARY_TECHS = ['Next.js', 'AWS', 'Prisma']

/** The hero flips through all of these. The first stands alone as the job title in the structured data */
export const ROLES = ['Software Engineer', 'Design Engineer', 'Open Source Contributor']

/** The keywords meta tag, gathered from the pieces above so each name and tech is written once */
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

/**
 * Markdown links written inside plain content strings, which get turned into real anchors on the
 * way to the page. Global, so anything reusing it must clone it rather than inherit its lastIndex.
 */
export const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

/** Geometry for the scroll progress ring, which draws its arc from the circumference */
export const BACK_TO_TOP_SIZE = 58

export const BACK_TO_TOP_CENTER = BACK_TO_TOP_SIZE / 2

/** Short of half the size, so the ring sits inside the button's edge rather than on it */
export const BACK_TO_TOP_RADIUS = 26.5

/** The full length of the stroke, which scroll progress is mapped onto as a dash offset */
export const BACK_TO_TOP_CIRCUMFERENCE = 2 * Math.PI * BACK_TO_TOP_RADIUS
