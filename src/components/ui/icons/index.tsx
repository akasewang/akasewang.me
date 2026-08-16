import type { IconWeight, Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  ApertureIcon,
  ArrowDownIcon,
  ArrowElbowDownLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  ArrowUUpLeftIcon,
  ArticleIcon,
  AtIcon,
  BellIcon,
  BlueprintIcon,
  BooksIcon,
  BroadcastIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  CameraIcon,
  CardholderIcon,
  CaretDoubleRightIcon,
  CaretDoubleUpIcon,
  CaretDownIcon,
  CaretUpIcon,
  ChatsCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  CirclesFourIcon,
  CopyIcon,
  CowIcon,
  CubeIcon,
  EnvelopeSimpleIcon,
  EnvelopeSimpleOpenIcon,
  EyeIcon,
  FacebookLogoIcon,
  GitCommitIcon,
  GithubLogoIcon,
  GlobeIcon,
  GridFourIcon,
  HashIcon,
  HouseIcon,
  LightbulbIcon,
  LinkedinLogoIcon,
  LinkIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MonitorPlayIcon,
  NewspaperIcon,
  PaperPlaneTiltIcon,
  PauseIcon,
  PlayIcon,
  QuestionIcon,
  QuotesIcon,
  RedditLogoIcon,
  RowsIcon,
  RssIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  StackIcon,
  TableIcon,
  TargetIcon,
  TerminalWindowIcon,
  UserCircleIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  WarningIcon,
  WhatsappLogoIcon,
  WifiSlashIcon,
  XCircleIcon,
  XIcon,
  XLogoIcon,
} from '@phosphor-icons/react/ssr'
import type * as React from 'react'
import { INITIALS_PATH, INITIALS_VIEW_BOX } from '@/constants/constants'
import { cn } from '@/utils/utils'

export * from './verified-icon'
export * from './volume'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number
}

interface PhosphorIconProps extends IconProps {
  weight?: IconWeight
}

/** The size an icon draws at when the thing using it does not say */
const DEFAULT_ICON_SIZE = 24

/**
 * Restates a size in rem so the icon follows the interface scale.
 *
 * A size lands on the svg's own width and height, where no class reaches it, so one given as a
 * count of pixels would hold flat while the text beside it grew. Callers still say 18 or 24 and
 * mean what those look like at the reader's base size; the conversion is what keeps that promise
 * once the interface is drawn larger. A size already carrying its own unit is passed through.
 */
const scalableSize = (size: string | number) =>
  typeof size === 'number' ? `${size / 16}rem` : size

/** Phosphor's two tone weight, which is the site's default for icons */
const duotone = (Icon: PhosphorIcon) =>
  function DuotoneIcon({
    size = DEFAULT_ICON_SIZE,
    weight = 'duotone',
    ...props
  }: PhosphorIconProps) {
    return <Icon {...props} size={scalableSize(size)} weight={weight} />
  }

/** A plain single weight, for the few icons that read badly with a second tone behind them */
const regular = (Icon: PhosphorIcon) =>
  function RegularIcon({
    size = DEFAULT_ICON_SIZE,
    weight = 'regular',
    ...props
  }: PhosphorIconProps) {
    return <Icon {...props} size={scalableSize(size)} weight={weight} />
  }

const check = duotone(CheckIcon)
const checkCircle = duotone(CheckCircleIcon)
const lightbulb = duotone(LightbulbIcon)

/**
 * Every icon the site draws, under names that say what they are for rather than what they depict,
 * so an icon can be swapped without hunting through the components that use it.
 */
export const Icons = {
  /**
   * The site's mark: initials in one stroke, drawn and undrawn on the grow keyframes.
   *
   * A mark that writes itself is Anthony Fu's idea. These strokes are this site's own initials and
   * none of his artwork is used.
   *
   * Anthony Fu: https://antfu.me
   * Source: https://github.com/antfu/antfu.me
   */
  initials: ({ size = 32, className, ...props }: IconProps) => (
    <svg
      viewBox={INITIALS_VIEW_BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={scalableSize(size)}
      height={scalableSize(size)}
      className={cn('initials-icon', className)}
      {...props}
    >
      <path className="initials-path" d={INITIALS_PATH} />
    </svg>
  ),

  arrowDownward: duotone(ArrowDownIcon),
  arrowBack: duotone(ArrowLeftIcon),
  arrowForward: duotone(ArrowRightIcon),
  arrowOutward: duotone(ArrowUpRightIcon),
  arrowUUpLeft: duotone(ArrowUUpLeftIcon),

  arrowUpKey: regular(ArrowUpIcon),
  arrowDownKey: regular(ArrowDownIcon),
  enterKey: regular(ArrowElbowDownLeftIcon),

  copy: duotone(CopyIcon),
  dataTable: duotone(TableIcon),

  chevronDown: duotone(CaretDownIcon),
  chevronUp: duotone(CaretUpIcon),

  projects: lightbulb,
  blogs: duotone(ArticleIcon),
  photos: duotone(CameraIcon),
  home: duotone(HouseIcon),
  skills: duotone(StackIcon),
  catalog: duotone(BooksIcon),
  testimonials: duotone(QuotesIcon),

  chatUpload: duotone(PaperPlaneTiltIcon),
  chatCheck: checkCircle,
  messageBoard: duotone(ChatsCircleIcon),

  newsletter: duotone(NewspaperIcon),
  mailCheck: duotone(EnvelopeSimpleOpenIcon),

  check,
  search: duotone(MagnifyingGlassIcon),
  menu: duotone(ListIcon),

  doubleArrowUp: duotone(CaretDoubleUpIcon),
  doubleChevronRight: duotone(CaretDoubleRightIcon),

  calendar: duotone(CalendarBlankIcon),
  calendarCheck: duotone(CalendarCheckIcon),

  bell: duotone(BellIcon),
  broadcast: duotone(BroadcastIcon),

  layoutGrid: duotone(GridFourIcon),
  layoutPanel: duotone(RowsIcon),

  gitCommit: duotone(GitCommitIcon),

  volumeUp: duotone(SpeakerHighIcon),
  volumeMute: duotone(SpeakerSlashIcon),

  wifiOff: duotone(WifiSlashIcon),
  eye: duotone(EyeIcon),

  mail: regular(EnvelopeSimpleIcon),
  share: duotone(ShareNetworkIcon),

  whatsapp: regular(WhatsappLogoIcon),
  facebook: regular(FacebookLogoIcon),
  reddit: regular(RedditLogoIcon),
  x: regular(XLogoIcon),

  close: regular(XIcon),

  linkedin: regular(LinkedinLogoIcon),
  github: duotone(GithubLogoIcon),

  rss: regular(RssIcon),

  cancelCircle: duotone(XCircleIcon),
  link: regular(LinkIcon),
  question: duotone(QuestionIcon),
  lightbulb,

  alertTriangle: duotone(WarningIcon),
  alertCircle: duotone(WarningCircleIcon),
  checkCircle,
  globe: duotone(GlobeIcon),
  aperture: duotone(ApertureIcon),
  blueprint: duotone(BlueprintIcon),
  terminalWindow: duotone(TerminalWindowIcon),
  target: duotone(TargetIcon),
  shieldCheck: duotone(ShieldCheckIcon),
  userCircle: duotone(UserCircleIcon),
  usersThree: duotone(UsersThreeIcon),
  cardholder: duotone(CardholderIcon),
  circlesFour: duotone(CirclesFourIcon),
  cow: duotone(CowIcon),
  cube: duotone(CubeIcon),
  at: duotone(AtIcon),
  monitorPlay: duotone(MonitorPlayIcon),

  play: duotone(PlayIcon),
  pause: duotone(PauseIcon),

  hash: duotone(HashIcon),
}
