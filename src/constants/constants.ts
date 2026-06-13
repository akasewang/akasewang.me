/**
 * Personal & Site Identity
 * Core configuration for the user portfolio.
 */
export const SITE_URL = 'https://www.akasewang.me'
/** Public first name used across personal metadata and generated page content. */
export const FIRST_NAME = 'Akash'
/** Public last name used across personal metadata and generated page content. */
export const LAST_NAME = 'Dewangan'
/** Full public name assembled from the canonical first and last name constants. */
export const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`
/** Site title used in metadata and Open Graph content. */
export const SITE_NAME = `${FULL_NAME} Portfolio`
/** Canonical username used for handles, metadata and keyword generation. */
export const USERNAME = 'akasewang'
/** Short domain label shown in compact UI copy. */
export const SITE = 'akasewang.me'
/** Public contact email address for profile and metadata surfaces. */
export const EMAIL = 'hi@akasewang.me'
/** Default site description used when a route does not provide a more specific summary. */
export const SITE_DESCRIPTION =
  'Software engineer who designs on the side. Welcome to my portfolio. It features my projects, some UI components and writing.'

/**
 * Date, Time & Reading Metrics
 * Constants used for formatting content timestamps and reading times.
 */
export const READING_SPEED = 200
/** Millisecond window used to decide whether dated content should be marked as new. */
export const TWO_WEEKS_MS = 1209600000
/** Display label used for open-ended date ranges. */
export const PRESENT = 'Present'
/** Canonical date output format used by shared formatting helpers. */
export const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy'
/** Long form date output used for day labels (e.g. "13 June 2026"). */
export const LONG_DATE_DISPLAY_FORMAT = 'd MMMM yyyy'
/** Accepted date input formats parsed by shared date utilities. */
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

/** Pagination & Display Limits */
export const MESSAGES_PER_PAGE = 20

/**
 * Skills & Professional Roles
 * Used for dynamic content injection in SEO and hero sections.
 */
export const CORE_TECHS = ['TypeScript', 'Python', 'SQL', 'PostgreSQL']
/** Secondary technologies included in profile copy and SEO keyword generation. */
export const SECONDARY_TECHS = ['Next.js', 'AWS', 'Prisma']
/** Professional roles surfaced in hero copy, metadata and search keywords. */
export const ROLES = ['Software Engineer', 'Design Engineer', 'Open Source Contributor']

/**
 * Global Search Keywords
 * Aggregated keywords for the root metadata configuration.
 */
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

/**
 * Regular Expressions
 * Used across utility files for parsing content and dates.
 */
export const CAPITALIZE_REGEX = /\b\w/g
/** Matches a four digit year-only date string. */
export const YEAR_REGEX = /^\d{4}$/
/** Matches numeric month and year strings such as `06.2026`. */
export const MONTH_YEAR_REGEX = /^\d{1,2}\.\d{4}$/
/** Matches numeric full date strings such as `08.06.2026`. */
export const FULL_DATE_REGEX = /^\d{1,2}\.\d{1,2}\.\d{4}$/
/** Matches text month and year strings such as `June 2026`. */
export const TEXT_MONTH_YEAR_REGEX =
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}$/i
/** Extracts markdown-style inline links from content strings. */
export const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * UI Component Dimensions
 * Specific mathematical constants for SVG drawing (e.g. BackToTop).
 */
export const BACK_TO_TOP_SIZE = 58
/** Center point used by the circular BackToTop SVG. */
export const BACK_TO_TOP_CENTER = BACK_TO_TOP_SIZE / 2
/** Radius used by the circular BackToTop progress indicator. */
export const BACK_TO_TOP_RADIUS = 26.5
/** Circumference used to convert BackToTop scroll progress into a stroke dash offset. */
export const BACK_TO_TOP_CIRCUMFERENCE = 2 * Math.PI * BACK_TO_TOP_RADIUS
