/**
 * Personal & Site Identity
 * Core configuration for the user portfolio.
 */
export const SITE_URL = 'https://akasewang.me'
export const FIRST_NAME = 'Akash'
export const LAST_NAME = 'Dewangan'
export const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`
export const SITE_NAME = `${FULL_NAME} Portfolio`
export const USERNAME = 'akasewang'
export const SITE = 'akasewang.me'
export const EMAIL = 'hi@akasewang.me'
export const SITE_DESCRIPTION =
  'Software engineer who designs on the side. Welcome to my portfolio. It features my projects, some UI components and writing.'

/**
 * Date, Time & Reading Metrics
 * Constants used for formatting content timestamps and reading times.
 */
export const READING_SPEED = 200
export const THIRTY_DAYS_MS = 2592000000
export const PRESENT = 'Present'
export const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy'
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
export const SECONDARY_TECHS = ['Next.js', 'AWS', 'Prisma']
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
export const YEAR_REGEX = /^\d{4}$/
export const MONTH_YEAR_REGEX = /^\d{1,2}\.\d{4}$/
export const FULL_DATE_REGEX = /^\d{1,2}\.\d{1,2}\.\d{4}$/
export const TEXT_MONTH_YEAR_REGEX =
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}$/i
export const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * UI Component Dimensions
 * Specific mathematical constants for SVG drawing (e.g. BackToTop).
 */
export const BACK_TO_TOP_SIZE = 58
export const BACK_TO_TOP_CENTER = BACK_TO_TOP_SIZE / 2
export const BACK_TO_TOP_RADIUS = 26.5
export const BACK_TO_TOP_CIRCUMFERENCE = 2 * Math.PI * BACK_TO_TOP_RADIUS
