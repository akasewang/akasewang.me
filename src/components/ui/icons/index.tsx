import * as React from 'react'
import { cn } from '@/utils/utils'

export * from './verified-icon'
export * from './volume'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number
}

export const Icons = {
  /** CUSTOM & BRAND ICONS */

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

  /** GENERAL USAGE */

  /** Category: Material Symbols */
  arrowDownward: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M11 4v12.175l-5.6-5.6L4 12l8 8l8-8l-1.4-1.425l-5.6 5.6V4z" />
    </svg>
  ),
  arrowBack: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z" />
    </svg>
  ),
  arrowForward: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z" />
    </svg>
  ),
  arrowOutward: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4z" />
    </svg>
  ),
  copy: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z" />
    </svg>
  ),
  dataTable: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M3 21V3h18v18zM5 8.325h14V5H5zm0 5.35h14v-3.35H5zM5 19h14v-3.325H5zM6 7.65v-2h2v2zM6 13v-2h2v2zm0 5.35v-2h2v2z" />
    </svg>
  ),

  /** Category: Remix Icons */
  chevronRight: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m13.172 12l-4.95-4.95l1.414-1.413L16 12l-6.364 6.364l-1.414-1.415z" />
    </svg>
  ),
  chevronDown: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z" />
    </svg>
  ),
  chevronUp: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z" />
    </svg>
  ),
  projects: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M9.973 18H11v-5h2v5h1.027c.132-1.202.745-2.193 1.74-3.277c.113-.122.832-.867.917-.973a6 6 0 1 0-9.37-.002c.086.107.807.853.918.974c.996 1.084 1.609 2.076 1.741 3.278M10 20v1h4v-1zm-4.246-5a8 8 0 1 1 12.49.002C17.624 15.774 16 17 16 18.5V21a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C8 17 6.375 15.774 5.754 15" />
    </svg>
  ),
  blogs: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1m-1-2V4H5v16zM7 6h4v4H7zm0 6h10v2H7zm0 4h10v2H7zm6-9h4v2h-4z" />
    </svg>
  ),
  photos: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M2 6c0-.552.455-1 .992-1h18.016c.548 0 .992.445.992 1v14c0 .552-.455 1-.992 1H2.992A.994.994 0 0 1 2 20zm2 1v12h16V7zm10 9a3 3 0 1 0 0-6a3 3 0 0 0 0 6m0 2a5 5 0 1 1 0-10a5 5 0 0 1 0 10M4 2h6v2H4z" />
    </svg>
  ),
  components: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M7 5a4 4 0 1 1 8 0h3a1 1 0 0 1 1 1v3a4 4 0 0 1 0 8v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4-2a2 2 0 0 0-1.886 2.667A1 1 0 0 1 8.17 7H5v12h12v-3.17a1 1 0 0 1 1.333-.944Q18.646 15 19 15a2 2 0 1 0-.667-3.886A1 1 0 0 1 17 10.17V7h-3.17a1 1 0 0 1-.944-1.333Q13 5.355 13 5a2 2 0 0 0-2-2" />
    </svg>
  ),
  chatUpload: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1zM4 18.385L5.763 17H20V5H4zM13 11v4h-2v-4H8l4-4l4 4z" />
    </svg>
  ),
  chatCheck: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1zm-.692-2H20V5H4v13.385zm5.53-4.879l4.243-4.242l1.414 1.414l-5.657 5.657l-3.89-3.89l1.415-1.414z" />
    </svg>
  ),
  messageBoard: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m6.5 22l-1-1v-4H2v-2l1.5-2.65V10H2V8h9v2H9.5v2.35L11 15v2H7.5v4zm5.5-2v-2h8V6H2V4h20v16zm-7.7-5h4.4l-1.2-2.1V10h-2v2.9zm2.2 0" />
    </svg>
  ),
  newsletter: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm2 1v14h16V5zm2 2h6v6H6zm2 2v2h2V9zm6 0h4V7h-4zm4 4h-4v-2h4zM6 15v2h12v-2z" />
    </svg>
  ),
  mailCheck: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M22 14h-2V7.238l-7.928 7.1L4 7.216V19h10v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1zM4.511 5l7.55 6.662L19.502 5zM19 22l-3.536-3.535l1.415-1.415L19 19.172l3.535-3.536l1.415 1.414z" />
    </svg>
  ),
  check: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m10 15.17l9.192-9.191l1.414 1.414L10 17.999l-6.364-6.364l1.414-1.414z" />
    </svg>
  ),
  search: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9s-9-4.032-9-9s4.032-9 9-9m0 16c3.867 0 7-3.133 7-7s-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7m8.485.071l2.829 2.828l-1.415 1.415l-2.828-2.829z" />
    </svg>
  ),
  menu: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M3 4h18v2H3zm0 7h12v2H3zm0 7h18v2H3z" />
    </svg>
  ),
  doubleArrowUp: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m12 4.836l-6.207 6.207l1.414 1.414L12 7.664l4.793 4.793l1.414-1.414zm0 5.65l-6.207 6.207l1.414 1.414L12 13.314l4.793 4.793l1.414-1.414z" />
    </svg>
  ),
  calendar: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M9 1v2h6V1h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1zm11 10H4v8h16zM8 13v2H6v-2zm5 0v2h-2v-2zm5 0v2h-2v-2zM7 5H4v4h16V5h-3v2h-2V5H9v2H7z" />
    </svg>
  ),
  calendarCheck: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M9 1v2h6V1h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1zm11 9H4v9h16zm-4.964 1.136l1.414 1.414l-4.95 4.95l-3.536-3.536L9.38 12.55l2.121 2.122zM7 5H4v3h16V5h-3v1h-2V5H9v1H7z" />
    </svg>
  ),
  bell: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M5 18h14v-6.969C19 7.148 15.866 4 12 4s-7 3.148-7 7.031zm7-16c4.97 0 9 4.043 9 9.031V20H3v-8.969C3 6.043 7.03 2 12 2M9.5 21h5a2.5 2.5 0 0 1-5 0" />
    </svg>
  ),
  broadcast: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m6.116 20.087l1.015-1.739a8 8 0 1 1 9.738 0l1.015 1.739A9.99 9.99 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.99 9.99 0 0 0 4.116 8.087m2.034-3.485a6 6 0 1 1 7.7 0l-1.03-1.766a4 4 0 1 0-5.64 0zM11 13h2v9h-2z" />
    </svg>
  ),
  layoutGrid: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 13H4v6h7zm9 0h-7v6h7zm-9-8H4v6h7zm9 0h-7v6h7z" />
    </svg>
  ),
  layoutPanel: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M22 20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1zm-11-5H4v4h7zm9-4h-7v8h7zm-9-6H4v8h7zm9 0h-7v4h7z" />
    </svg>
  ),
  terminal: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M11 19h8v-2h-8v2zm-7.6-6.1L2 11.5l5.5-5.5l1.42 1.4L4.82 11.5L8.92 15.6l-1.42 1.4z" />
    </svg>
  ),

  /** Category: TDesign Icons */
  wifiOff: ({ size = 24, ...props }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      width={size}
      height={size}
      {...props}
    >
      <path d="M2.1 9.1A13.94 13.94 0 0 1 8 5.582m8 0a13.94 13.94 0 0 1 5.9 3.52M6.697 13.697q.607-.604 1.303-1.043m8 0q.697.438 1.303 1.043M12 3v11m-.707 4.293a1 1 0 0 1 1.414 0L12 19z" />
    </svg>
  ),

  /** Category: Tabler Icons */
  users: ({ size = 24, ...props }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      {...props}
    >
      <path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
  ),

  /** SOCIAL MEDIA & SHARING ICONS */

  /** Category: Material Symbols */
  mail: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z" />
    </svg>
  ),

  /** Category: Remix Icons */
  share: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m12 2.586l6.207 6.207l-1.414 1.414L13 6.414V16h-2V6.414l-3.793 3.793l-1.414-1.414zM3 18v-4h2v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4h2v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3" />
    </svg>
  ),
  whatsapp: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m7.254 18.494l.724.423A7.95 7.95 0 0 0 12.001 20a8 8 0 1 0-8-8a7.95 7.95 0 0 0 1.084 4.024l.422.724l-.653 2.401zM2.005 22l1.352-4.968A9.95 9.95 0 0 1 2.001 12c0-5.523 4.477-10 10-10s10 4.477 10 10s-4.477 10-10 10a9.95 9.95 0 0 1-5.03-1.355zM8.392 7.308q.202-.014.403-.004q.081.006.162.016c.159.018.334.115.393.249q.447 1.015.868 2.04c.062.152.025.347-.093.537c-.06.097-.154.233-.263.372c-.113.145-.356.411-.356.411s-.099.118-.061.265c.014.056.06.137.102.205l.059.095c.256.427.6.86 1.02 1.268c.12.116.237.235.363.346c.468.413.998.75 1.57 1l.005.002c.085.037.128.057.252.11q.093.039.191.066q.036.01.073.011a.35.35 0 0 0 .295-.142c.723-.876.79-.933.795-.933v.002a.48.48 0 0 1 .378-.127q.092.004.177.04c.531.243 1.4.622 1.4.622l.582.261c.098.047.187.158.19.265c.004.067.01.175-.013.373c-.032.259-.11.57-.188.733a1.2 1.2 0 0 1-.21.302a2.4 2.4 0 0 1-.33.288q-.124.092-.125.09a5 5 0 0 1-.383.22a2 2 0 0 1-.833.23c-.185.01-.37.024-.556.014c-.008 0-.568-.087-.568-.087a9.45 9.45 0 0 1-3.84-2.046c-.226-.199-.436-.413-.65-.626c-.888-.885-1.561-1.84-1.97-2.742a3.5 3.5 0 0 1-.33-1.413a2.73 2.73 0 0 1 .565-1.68c.073-.094.142-.192.261-.305c.126-.12.207-.184.294-.228a1 1 0 0 1 .371-.1" />
    </svg>
  ),
  facebook: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M15.402 21v-6.966h2.333l.349-2.708h-2.682V9.599c0-.784.218-1.319 1.342-1.319h1.434V5.857a19 19 0 0 0-2.09-.107c-2.067 0-3.482 1.262-3.482 3.58v1.996h-2.338v2.708h2.338V21H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1z" />
    </svg>
  ),
  reddit: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m11.053 7.815l.751-3.536a2 2 0 0 1 2.372-1.54l3.196.68a2 2 0 1 1-.415 1.956l-3.197-.68l-.666 3.135c1.785.137 3.558.73 5.164 1.7A3.192 3.192 0 0 1 23 12.203v.021a3.2 3.2 0 0 1-1.207 2.55l-.008.123c0 3.998-4.45 7.03-9.799 7.03c-5.333 0-9.708-3.024-9.705-6.953l-.01-.181a3.193 3.193 0 0 1 3.454-5.35a11.45 11.45 0 0 1 5.329-1.628m9.285 5.526a1.19 1.19 0 0 0 .662-1.075a1.192 1.192 0 0 0-2.016-.806l-.585.56l-.67-.455c-1.615-1.098-3.452-1.725-5.23-1.764h-1.006c-1.875.028-3.652.6-5.237 1.675l-.664.45l-.583-.55a1.192 1.192 0 1 0-1.315 1.952l.633.29l-.053.695a4 4 0 0 0 .003.584c0 2.71 3.356 5.03 7.708 5.03c4.371 0 7.799-2.336 7.802-5.107a3 3 0 0 0 0-.507l-.052-.672zM6.951 13.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m7 0a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m-1.985 5.103c-1.397 0-2.766-.37-3.881-1.21a.424.424 0 0 1 .597-.597c.945.693 2.123.99 3.269.99s2.33-.275 3.284-.959a.44.44 0 0 1 .732.206a.47.47 0 0 1-.12.423c-.683.797-2.483 1.147-3.88 1.147" />
    </svg>
  ),
  x: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <g transform="translate(1.2, 1.2) scale(0.90)">
        <path d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z" />
      </g>
    </svg>
  ),
  linkedin: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <g transform="translate(-0.24, -0.24) scale(1.02)">
        <path d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714M7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z" />
      </g>
    </svg>
  ),

  /** Category: Line Awesome Icons */
  rss: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 32 32" fill="currentColor" width={size} height={size} {...props}>
      <path d="M5 5v22h22V5zm2 2h18v18H7zm5 3a10 10 0 0 0-2 .188v2.062a8 8 0 0 1 2-.25c4.41 0 8 3.59 8 8a8 8 0 0 1-.25 2h2.063A10 10 0 0 0 22 20c0-5.516-4.484-10-10-10m0 4a6 6 0 0 0-2 .344v2.219A3.97 3.97 0 0 1 12 16c2.207 0 4 1.793 4 4c0 .73-.219 1.41-.563 2h2.22A6 6 0 0 0 18 20c0-3.309-2.691-6-6-6m0 4a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4" />
    </svg>
  ),

  /** MDX COMPONENTS & SONNER TOASTS */

  /** Category: Material Symbols */
  cancelCircle: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
    </svg>
  ),

  /** Category: Remix Icons */
  link: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m13.06 8.111l1.415 1.414a7 7 0 0 1 0 9.9l-.354.353a7 7 0 1 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415zm6.718 6.01l-1.414-1.414a5 5 0 0 0-7.071-7.07l-.354.353a5 5 0 0 0 0 7.07l1.415 1.415l-1.415 1.414l-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 1 1 9.9 9.9" />
    </svg>
  ),
  question: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-5h2v2h-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1a1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355" />
    </svg>
  ),
  lightbulb: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M9.973 18H11v-5h2v5h1.027c.132-1.202.745-2.193 1.74-3.277c.113-.122.832-.867.917-.973a6 6 0 1 0-9.37-.002c.086.107.807.853.918.974c.996 1.084 1.609 2.076 1.741 3.278M10 20v1h4v-1zm-4.246-5a8 8 0 1 1 12.49.002C17.624 15.774 16 17 16 18.5V21a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C8 17 6.375 15.774 5.754 15" />
    </svg>
  ),
  alertTriangle: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0m-8.66 16h15.588L12 5.5zM11 16h2v2h-2zm0-7h2v5h-2z" />
    </svg>
  ),
  alertCircle: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-5h2v2h-2zm0-8h2v6h-2z" />
    </svg>
  ),
  checkCircle: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M4 12a8 8 0 1 1 16 0a8 8 0 0 1-16 0m8-10C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5.457 7.457l-1.414-1.414L11 13.086l-2.793-2.793l-1.414 1.414L11 15.914z" />
    </svg>
  ),
  play: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M16.394 12L10 7.737v8.526zm2.982.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832" />
    </svg>
  ),
  pause: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="M6 5h2v14H6zm10 0h2v14h-2z" />
    </svg>
  ),
  hash: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
      <path d="m7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2zm2.011 0h3.99l.42-4h-3.99z" />
    </svg>
  ),

  /** Category: Famicons */
  hackerNews: ({ size = 24, ...props }: IconProps) => (
    <svg viewBox="0 0 512 512" fill="currentColor" width={size} height={size} {...props}>
      <g transform="translate(25.6, 25.6) scale(0.90)">
        <path d="M32 32v448h448V32Zm249.67 250.83v84H235v-84l-77-140h55l46.32 97.54l44.33-97.54h52.73Z" />
      </g>
    </svg>
  ),
}
