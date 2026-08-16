/**
 * The canonical origin, www and all, that every absolute URL on the site is built from: the
 * metadata base, the breadcrumb trails and the ids in the structured data.
 */
export const SITE_URL = 'https://www.akasewang.me'

/** Kept apart from the surname because plenty of the copy uses one name on its own */
export const FIRST_NAME = 'Akash'

/** Only ever used to build the full name below */
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

/** Where the source lives, as against the API address the star count and changelog read */
export const GITHUB_URL = `https://github.com/${USERNAME}/${SITE}`

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
 * The same for a post's own board, which is smaller. A post sits below its own reading and should
 * not open with a wall of replies, so it loads a short page and grows as it is scrolled.
 */
export const POST_BOARD_PAGE_SIZE = 10

/**
 * What the site claims to know, in two tiers. The core is the everyday stack and the secondary is
 * what sits around it. Both go into the structured data and into the keyword list below.
 */
export const CORE_TECHS = ['TypeScript', 'Python', 'SQL', 'PostgreSQL']

/** The ones worked with rather than led with, listed after the core in anything that names both */
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
/** 2025 */
export const YEAR_REGEX = /^\d{4}$/

/** 7.2025 */
export const MONTH_YEAR_REGEX = /^\d{1,2}\.\d{4}$/

/** 21.7.2025 */
export const FULL_DATE_REGEX = /^\d{1,2}\.\d{1,2}\.\d{4}$/

/** July 2025 */
export const TEXT_MONTH_YEAR_REGEX =
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}$/i

/**
 * Markdown links written inside plain content strings, which get turned into real anchors on the
 * way to the page. Global, so anything reusing it must clone it rather than inherit its lastIndex.
 */
export const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * The mark's outline, shared by the navbar icon and the social card.
 *
 * Held here rather than beside the icon because the social card is drawn without React and cannot
 * import that component. `icon.svg` keeps its own copy, being a static file, and is the one place
 * to edit alongside this.
 */
export const INITIALS_PATH =
  'm 7.8293982,18.547094 c -0.2832514,-0.936816 -1.8081924,-0.975988 -3.8588893,1.436597 -0.3626676,0.39289 -0.6648907,0.816002 -0.9066692,1.269338 -0.211556,0.453334 -0.3626676,0.876447 -0.4533346,1.269336 -0.060444,0.362668 -0.030222,0.664891 0.090667,0.906669 0.1208892,0.24178 0.3324454,0.362667 0.6346684,0.362667 0.4231123,0 0.8613357,-0.226667 1.3146703,-0.680001 C 5.1038456,22.628144 5.5269579,22.084143 5.9198479,21.479696 6.34296,20.875249 6.73585,20.285915 7.0985178,19.711689 7.4872653,19.082613 7.8038346,18.674184 7.8138812,18.63826 c -2.3505635,7.154207 3.8813858,4.282557 5.9877058,1.753432 0.39289,-0.53898 0.673122,-0.935321 1.050899,-1.282877 2.548959,-2.345048 3.916665,-0.149716 3.981143,1.010884 -0.328093,-2.479043 -2.530989,-2.54984 -3.978014,-1.008671 -0.702744,0.748464 -1.386447,1.749116 -1.96067,3.139343 -0.302223,0.695113 -0.39289,1.284447 -0.272001,1.768004 0.151113,0.483556 0.438223,0.725336 0.861337,0.725336 0.423112,0 0.982225,-0.24178 1.677337,-0.725336 0.695114,-0.513779 1.465782,-1.178668 2.312007,-1.994671 0.876447,-0.846225 1.798227,-1.828452 2.765342,-2.946675 0.967114,-1.118227 1.904004,-2.296896 2.810674,-3.536011 0.936891,-1.239115 1.813338,-2.493342 2.629341,-3.762676 0.816,-1.299558 1.526224,-2.5537846 2.130671,-3.7626768 0.846224,-1.6320045 1.360004,-2.9466748 1.541337,-3.9440111 0.181334,-1.0275584 0,-1.5413376 -0.544001,-1.5413376 -0.604446,0 -1.344893,0.6648908 -2.22134,1.9946723 -0.876447,1.2995592 -1.858671,3.2337866 -2.946674,5.8026832 -0.241777,0.574223 -0.619556,1.435557 -1.133337,2.584005 -0.483556,1.14845 -1.012447,2.432896 -1.586671,3.853344 -0.574223,1.390227 -1.133337,2.840897 -1.677337,4.352012 -0.513781,1.480894 -0.921781,2.856008 -1.224004,4.125346 -0.302223,1.269336 -0.453334,2.34223 -0.453334,3.218676 0.03022,0.846224 0.302225,1.344892 0.816001,1.496005'

/** Cropped tighter than a square, which is why the mark is not drawn from 0 0 */
export const INITIALS_VIEW_BOX = '0 2 32 32'
