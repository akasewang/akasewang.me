import type { IconWeight, Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Article,
  Bell,
  Books,
  Broadcast,
  CalendarBlank,
  CalendarCheck,
  Camera,
  CaretDoubleRight,
  CaretDoubleUp,
  CaretDown,
  CaretUp,
  ChatsCircle,
  Check,
  CheckCircle,
  Copy,
  EnvelopeSimple,
  EnvelopeSimpleOpen,
  Eye,
  FacebookLogo,
  GitCommit,
  GithubLogo,
  GridFour,
  Hash,
  House,
  Lightbulb,
  Link,
  LinkedinLogo,
  List,
  MagnifyingGlass,
  Newspaper,
  PaperPlaneTilt,
  Pause,
  Play,
  Question,
  Quotes,
  RedditLogo,
  Rows,
  Rss,
  ShareNetwork,
  SpeakerHigh,
  SpeakerSlash,
  Stack,
  Table,
  Warning,
  WarningCircle,
  WhatsappLogo,
  WifiSlash,
  X,
  XCircle,
  XLogo,
} from '@phosphor-icons/react/dist/ssr'
import type * as React from 'react'
import { cn } from '@/utils/utils'

export * from './verified-icon'
export * from './volume'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number
}

interface PhosphorIconProps extends IconProps {
  weight?: IconWeight
}

/** Phosphor's two tone weight, which is the site's default for icons */
const duotone = (Icon: PhosphorIcon) =>
  function DuotoneIcon({ size = 24, weight = 'duotone', ...props }: PhosphorIconProps) {
    return <Icon {...props} size={size} weight={weight} />
  }

/** A plain single weight, for the few icons that read badly with a second tone behind them */
const regular = (Icon: PhosphorIcon) =>
  function RegularIcon({ size = 24, weight = 'regular', ...props }: PhosphorIconProps) {
    return <Icon {...props} size={size} weight={weight} />
  }

const check = duotone(Check)
const checkCircle = duotone(CheckCircle)
const lightbulb = duotone(Lightbulb)

/**
 * Every icon the site draws, under names that say what they are for rather than what they depict,
 * so an icon can be swapped without hunting through the components that use it.
 */
export const Icons = {
  initials: ({ size = 32, className, ...props }: IconProps) => (
    <svg
      viewBox="0 2 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={cn('initials-icon', className)}
      {...props}
    >
      <path
        className="initials-path"
        d="m 7.8293982,18.547094 c -0.2832514,-0.936816 -1.8081924,-0.975988 -3.8588893,1.436597 -0.3626676,0.39289 -0.6648907,0.816002 -0.9066692,1.269338 -0.211556,0.453334 -0.3626676,0.876447 -0.4533346,1.269336 -0.060444,0.362668 -0.030222,0.664891 0.090667,0.906669 0.1208892,0.24178 0.3324454,0.362667 0.6346684,0.362667 0.4231123,0 0.8613357,-0.226667 1.3146703,-0.680001 C 5.1038456,22.628144 5.5269579,22.084143 5.9198479,21.479696 6.34296,20.875249 6.73585,20.285915 7.0985178,19.711689 7.4872653,19.082613 7.8038346,18.674184 7.8138812,18.63826 c -2.3505635,7.154207 3.8813858,4.282557 5.9877058,1.753432 0.39289,-0.53898 0.673122,-0.935321 1.050899,-1.282877 2.548959,-2.345048 3.916665,-0.149716 3.981143,1.010884 -0.328093,-2.479043 -2.530989,-2.54984 -3.978014,-1.008671 -0.702744,0.748464 -1.386447,1.749116 -1.96067,3.139343 -0.302223,0.695113 -0.39289,1.284447 -0.272001,1.768004 0.151113,0.483556 0.438223,0.725336 0.861337,0.725336 0.423112,0 0.982225,-0.24178 1.677337,-0.725336 0.695114,-0.513779 1.465782,-1.178668 2.312007,-1.994671 0.876447,-0.846225 1.798227,-1.828452 2.765342,-2.946675 0.967114,-1.118227 1.904004,-2.296896 2.810674,-3.536011 0.936891,-1.239115 1.813338,-2.493342 2.629341,-3.762676 0.816,-1.299558 1.526224,-2.5537846 2.130671,-3.7626768 0.846224,-1.6320045 1.360004,-2.9466748 1.541337,-3.9440111 0.181334,-1.0275584 0,-1.5413376 -0.544001,-1.5413376 -0.604446,0 -1.344893,0.6648908 -2.22134,1.9946723 -0.876447,1.2995592 -1.858671,3.2337866 -2.946674,5.8026832 -0.241777,0.574223 -0.619556,1.435557 -1.133337,2.584005 -0.483556,1.14845 -1.012447,2.432896 -1.586671,3.853344 -0.574223,1.390227 -1.133337,2.840897 -1.677337,4.352012 -0.513781,1.480894 -0.921781,2.856008 -1.224004,4.125346 -0.302223,1.269336 -0.453334,2.34223 -0.453334,3.218676 0.03022,0.846224 0.302225,1.344892 0.816001,1.496005"
      />
    </svg>
  ),
  arrowDownward: duotone(ArrowDown),
  arrowBack: duotone(ArrowLeft),
  arrowForward: duotone(ArrowRight),
  arrowOutward: duotone(ArrowUpRight),
  copy: duotone(Copy),
  dataTable: duotone(Table),
  chevronDown: duotone(CaretDown),
  chevronUp: duotone(CaretUp),
  projects: lightbulb,
  blogs: duotone(Article),
  photos: duotone(Camera),
  home: duotone(House),
  skills: duotone(Stack),
  catalog: duotone(Books),
  testimonials: duotone(Quotes),
  chatUpload: duotone(PaperPlaneTilt),
  chatCheck: checkCircle,
  messageBoard: duotone(ChatsCircle),
  newsletter: duotone(Newspaper),
  mailCheck: duotone(EnvelopeSimpleOpen),
  check,
  search: duotone(MagnifyingGlass),
  menu: duotone(List),
  doubleArrowUp: duotone(CaretDoubleUp),
  doubleChevronRight: duotone(CaretDoubleRight),
  calendar: duotone(CalendarBlank),
  calendarCheck: duotone(CalendarCheck),
  bell: duotone(Bell),
  broadcast: duotone(Broadcast),
  layoutGrid: duotone(GridFour),
  layoutPanel: duotone(Rows),
  gitCommit: duotone(GitCommit),
  volumeUp: duotone(SpeakerHigh),
  volumeMute: duotone(SpeakerSlash),
  wifiOff: duotone(WifiSlash),
  eye: duotone(Eye),
  mail: duotone(EnvelopeSimple),
  share: duotone(ShareNetwork),
  whatsapp: duotone(WhatsappLogo),
  facebook: duotone(FacebookLogo),
  reddit: duotone(RedditLogo),
  x: duotone(XLogo),
  close: regular(X),
  linkedin: duotone(LinkedinLogo),
  github: duotone(GithubLogo),
  rss: regular(Rss),
  cancelCircle: duotone(XCircle),
  link: duotone(Link),
  question: duotone(Question),
  lightbulb,
  alertTriangle: duotone(Warning),
  alertCircle: duotone(WarningCircle),
  checkCircle,
  play: duotone(Play),
  pause: duotone(Pause),
  hash: duotone(Hash),
  hackerNews: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 512 512" fill="currentColor" width={size} height={size} {...props}>
      <path d="M32 32v448h448V32Zm249.67 250.83v84H235v-84l-77-140h55l46.32 97.54l44.33-97.54h52.73Z" />
    </svg>
  ),
}
