# UI & Animations

## Styling (Tailwind v4)

- Tailwind CSS v4 defines the whole design system in CSS through `@theme` and custom properties (colours are authored in `oklch`), so there is no large JavaScript config file.
- **Interface scale:** the whole interface is drawn 3% larger than its natural size, driven by
  `--ui-scale` on the root font size so everything stated in rem follows at once. Tooltips are the
  one deliberate exception. See [Interface scale](./ui-scale.md) for what it reaches, what opts out
  and how to write new values that follow it.
- **Optical spacing:** a few local offsets deliberately prioritize perceived alignment over equal
  numeric gaps. Their values and reasons are recorded in
  [Optical Spacing Adjustments](./optical-spacing.md) so later cleanup does not normalize them away.
- **Transition property lists:** v4 writes `translate`, `scale` and `rotate` as their own CSS
  properties rather than folding them into `transform`, so a hand written
  `transition-[transform,...]` has to name each one it animates or that value snaps instead of
  moving. `transition-transform` covers all four.
- **Custom Cursor:** `src/app/cursor.css` defines data-URI cursors for default, pointer, text,
  loading, grab and zoom states. Cursor selection is entirely CSS-driven and does not add
  pointer-tracking React state.
- **Site Canvas Background:** `SiteBackground` is mounted once in the root layout and loads
  `BranchingBackground` dynamically with SSR disabled, so the canvas is client-only and every route
  gets the same one. There is no per-page selection.
- **Branching Background:** Randomized branches grow inward from all four viewport edges on desktop
  and from the top and bottom on screens narrower than 500px. A radial mask clears the denser
  centre. Each branch is guaranteed its first twelve segments so none ends as a speck, after which
  it grows on coin flips until it leaves the frame. Segment caps of 60,000 on desktop and 30,000 on
  mobile are a safety net for a branch that keeps finding room, not the usual reason a drawing
  finishes. The animation runs at 40fps, pauses in hidden documents and draws a bounded static
  result for reduced motion.
- **Viewport Change Handling:** The canvas regrows the branching animation in response to viewport changes:
  desktop window resize, DevTools viewport resize, browser zoom in/out, and phone rotation. The canvas is
  sized using `100lvh` (the viewport height with browser chrome retracted), so a mobile browser chrome
  appearing or disappearing while scrolling does not regrow it. Resize, orientation and pixel-density
  signals share one debounce, and a redraw happens when width or height move more than 2% (or 25% for
  height on touch viewports without `lvh` support), or pixel density changes. Density is watched with
  a `matchMedia` resolution query, since moving a window to a display of a different density fires no resize event.
- **Uniform Page Surface:** `html` and `body` both paint the same `--background` value, while the
  fixed canvas remains transparent and only draws its strokes. `body` creates the isolated stacking
  context used by the negative-z canvas, so page sections do not need their own full-width background
  layers and mobile compositing cannot introduce differently shaded seams between them.
- **Canvas Pixel Budget:** The canvas caps device pixel ratio at 2x and its backing store at ten
  million pixels, so a 4K or high-DPI display cannot make a subtle full-screen texture allocate an
  oversized buffer.
- **Scroll Edge Fades:** `.scroll-fade-y` uses three composited mask layers and activates only when
  `useScrollOverflow` marks a viewport as genuinely scrollable. Modern browsers drive the top and
  bottom mask heights with a scroll timeline; the hook supplies the same CSS variables from a
  requestAnimationFrame-coalesced scroll listener where that API is unavailable. Resize and
  mutation observers keep the overflow decision current without fading content that already fits.
- **Retina Hairlines:** one-pixel surface rings and separator borders pair their normal width with
  the global `retina` variant, which reduces them to `0.5px` on displays with at least two device
  pixels per CSS pixel. Loading skeletons use the same rule as the content they replace.
- **Form Fields:** `Input` and `TextArea` share one neutral field treatment with the action button's
  corner radius, stronger keyboard focus, disabled and invalid states, and explicit dark browser
  autofill paint so selecting a saved value cannot replace the surface or text colours. They share it
  literally, through `FORM_FIELD_CLASS`, rather than each holding a copy that happens to match; only
  the box each sits in is its own, which is why the size is not part of it.

## Animations (Framer Motion)

- A root `MotionProvider` wraps the app in `LazyMotion` with the synchronous `domMax` feature set and
  strict mode. Components use the `m` API consistently while retaining `layout` and `layoutId`
  support; `domMax` is bundled rather than loaded through an asynchronous feature loader.
- **Reduced Motion:** the provider sets `MotionConfig reducedMotion="user"`, which handles
  declarative `m` transform and layout motion. Imperative animation paths and non-Motion CSS or
  canvas effects handle the preference separately through `prefersReducedMotion` in
  `src/utils/motion.ts`: the highlight box, cursor lean and canvas backgrounds all read it, CSS
  transitions and keyframes use `motion-reduce:*`, and the marquee plates are stilled by a rule in
  `globals.css`. The helper caches the `MediaQueryList` rather than its answer, since it is called
  per pointer move and a live query keeps reporting the current preference without a subscription.
- **Initial Reveal:** `InitialLoader` covers the first paint with a counter running to 100, then
  leaves in three overlapping parts rather than one fade: the digits thin out one after another on
  a stagger, the veil over the page begins a beat later, and the page resolves out of a backdrop
  blur that finishes ahead of the veil so nothing sharpens in full view. The blurred layer is
  mounted only for the fade, a backdrop filter costing something on every frame it exists.
  Scrolling and keyboard interaction are held until the veil is gone and restored under a guard, so
  teardown cannot leave them locked. Timings live in `src/constants/ui.ts` as the `REVEAL_*` values
  and the timeline they add up to is asserted in `tools/initial-loader.test.ts`. Reduced motion
  skips the sequence entirely.
- **Page Travel:** `PageTransition` keys the routed subtree by pathname and uses `AnimatePresence`
  in wait mode, while `FrozenRouter` pins the outgoing App Router contexts until its exit completes.
  Section changes follow navbar order horizontally, detail pages move vertically, and previous/next
  controls record both directions of sibling travel so browser Back reverses the original motion.
  `PageArrivalContext` pauses observers, layout projection and video playback until the incoming
  page settles; its route-keyed timeout is only a deadlock guard. Browser scroll restoration is
  manual during the app lifetime, applied before the incoming page paints, and restored on teardown.
- **Command Menu:** `RootLayout` reads blog and project metadata on the server through
  `getContentCommandGroups`, then passes serializable groups into the client-side `CommandMenu`.
  The first view contains section rows rather than every command; selecting one slides the section
  list out, slides that section's searchable rows in and springs the surrounding frame to its new
  height. Blog and project rows expose their date, excerpt and searchable metadata. Escape or an
  empty Backspace returns to sections, the platform-specific modifier plus K opens the dialog, and
  reduced motion disables both the slide and layout springs. A view swap temporarily disables the
  autocomplete so a departing row cannot execute, and closing preserves the current contents until
  the popup's exit animation is gone; the next open resets to sections. Search terms and highlight
  patterns are prepared once per query and reused by every row. The search and footer bars are
  direct children of the popup; only the scrollable results viewport owns an inset surface and
  overflow mask.
- **Spotlight Card**: Cards track pointer velocity on hover. Moving fast brightens the spotlight and slowing down fades it out smoothly.
- **Card Media Lean:** one positioned media frame wraps the image, video or animated fallback, so
  all three use the same GPU-backed `translate3d + scale` transform without colliding with the
  fallback's own rotated marquee. `useCursorParallax` keeps only the latest pointer position and
  performs one layout read and style write per animation frame, with no React render. Its maximum
  drift is derived from 80% of the slack opened by `PROJECT_MEDIA_ZOOM`, so changing the zoom cannot
  expose a card edge. Pointer cancellation and reduced motion return the frame to its origin;
  off-screen, hidden-document and reduced-motion videos stay paused. Both zoom and drift are gated
  on a real fine hover pointer, independent of viewport width.
- **Smooth Layouts**: Filtered lists use Framer `layout` animations, so items tween to their new positions instead of jumping instantly.
- **Animated Filters and MDX Tabs:** Category filters, including blog and project filters, use a
  per-instance `layoutId` to slide the active background. `SubCategoryFilter` is the same control a
  level down, for a choice made under one already taken further up the page: the same sliding block
  in a muted fill rather than the solid one. Both only pick. MDX tabs use overlapping notebook-style
  controls that shift on hover or press and directionally swap a height-measured panel; they do not
  use the shared indicator.
- **Category Travel:** `CategoryTransition` carries whatever a filter is filtering, so changing the
  choice moves the way changing a page does. It is kept apart from the filters, a row of chips and
  the thing beneath it being two jobs, which is what lets a filter be used with it or without it.
  Only the skeleton preview uses it; the filters elsewhere on the site are unaffected. The split
  mirrors the route transition's own: `resolveCategoryTravel` in `src/utils/` answers the direction
  as a pure function the way `resolvePageTravel` does, and the component holds the variants and the
  `AnimatePresence`. Categories are siblings in those terms, the same section at the same depth, so
  there is no axis to settle and only a sign, taken from the order the chips sit in rather than from
  a remembered control. `PAGE_SLIDE_X` is a share of the viewport because a page has to clear the
  screen; a panel has only to clear itself, so the same rule there is its own width, and the distance
  needs no measurement of its own. Children are keyed on the value, so each change mounts them
  afresh, which is what makes a skeleton's pulses start together rather than mid cycle.
- **Collapse Without Snapping**: `show less` animates height through `AnimatePresence`, and React
  commits one collapsed layout before the animation puts the space back. Near the end of the document
  that single frame is enough for the browser to clamp the window to the new maximum permanently, so
  the whole scroll correction lands before any of the collapse is visible. Measured at the page
  bottom, that was a 1411px teleport in the first painted frame. `useCollapseScroll` follows the
  document's own maximum every frame from inside the same frame as the click, so the clamp is undone
  before it is ever painted and the window then eases up at exactly the rate the height shrinks.
  The collapsing block sets `overflow-anchor: none` so native scroll anchoring does not fight it.
  `ExpandableContent` deliberately does not use this: a CSS `grid-template-rows` transition gives the
  space back a frame at a time, which the browser already follows smoothly.
- **Show More Toggle**: Both labels stay mounted in one grid cell, so the button keeps the width of
  the longer word and the underline never retimes. The underline and arrows animate transforms rather
  than `width` or `background-size`.
- **Action Button State:** The shared `Button` uses one icon-and-label surface rather than a split
  arrow segment. Primary actions use a lightly rounded outline, a 36px minimum height and a light
  14px label; hover adds a yellow tint and changes the icon from duotone to filled. Pending uses that
  yellow state, success turns green and blocked or failed cooldown states turn red. `TextFlip` owns
  the vertical replacement motion for every label state, with no width or layout animation between
  differently sized labels.
- **Load Button:** `LoadButton` asks for the next page of a list that is not free to load on scroll.
  It is built on `Button` rather than styled beside it, so the two cannot drift, and exposes only the
  states a load has, which are resting and working: nothing to confirm, so no success state, and
  nothing to wait out, so no countdown. It is smaller than the button it is built on and carries no
  icon, asking for more of what is already on screen being the quietest thing on a page.

## Loading Skeletons & Transitions

- **Reusable Skeleton:** `src/components/ui/skeleton.tsx` provides a zero-dependency, accessible
  placeholder primitive. Every block picks one of four tones rather than an opacity: `panel` for
  large fills such as media and inputs, `muted` for dates and meta lines, `base` for body text and
  `strong` for headings, so a heading stays heavier than the line beneath it on every page.
  `SkeletonText` composes those into a paragraph whose line height and gap add up to the height the
  real prose occupies.
- **Shared Skeleton Pieces:** every composed placeholder lives in `src/components/skeletons/`, beside
  the others rather than next to whatever it stands in for, since a skeleton is read against its
  siblings more often than against its subject. `shared.tsx` holds the parts more than one route
  needs: section titles, category filters, search rows, timelines, post lists, MDX headers and
  bodies, and form fields and buttons. The `Skeleton` and `SkeletonText` atoms stay in
  `src/components/ui/`, being primitives these are built from rather than placeholders themselves.
  Structure comes from spacing and tonal weight alone, since a hairline rule inside a skeleton reads
  as content that never turns up.
- **Card and Skeleton Ratio:** `PROJECT_CARD_ASPECT`, `PROJECT_GRID_CLASS`, `TESTIMONIAL_GRID_CLASS`
  and `TESTIMONIALS_PAGE_CLASS` live beside their skeletons and are read by the real components too,
  so a placeholder and the thing it stands in for cannot drift into different sizes and make the
  layout jump as one swaps for the other. The photos page shares the most consequential of them:
  `PHOTOS_PAGE_CLASS` is what breaks that page out of the content column to the full viewport, so a
  difference between the two sides would shift not a row but the whole page under it, and
  `PHOTOS_RAIL_CLASS` and `PHOTOS_GRID_CLASS` hold the rail and the grid beside it.
  `HERO_ROW_CLASS`, `CATEGORY_FILTER_ROW_CLASS`, `TESTIMONIAL_CAPTION_CLASS` and `REPLY_ROW_CLASS`
  do the same for the smaller rows. The changelog does the same with its whole timeline
  geometry, `CHANGELOG_RAIL_CLASS` and its neighbours fixing where the dashed rail, the commit marks
  and the mobile stubs sit; colour is left out of every one of them, being the only thing the real
  timeline and its placeholder differ on. `SOCIAL_LINKS_GRID_CLASS` and `SOCIAL_LINKS_ROW_CLASS` do
  the same for the links and domains directories, and `BUBBLE_WIDTH_CLASS` and `BUBBLE_BASE_CLASS`
  for the message bubbles. Widths in those directories are measured in `ch` against the font the real
  text will be set in, counting the arrow a link carries at rest, so a row wraps where the real one
  will rather than one entry earlier.
- **Page Copy:** a page's title, standfirst and closing line all come from its object in
  `src/data/content/`, and its loading file reads the same object. Written out at each call site
  instead, a page and the placeholder shown while it loads could say different things, which is the
  one difference a reader would actually notice mid load.
- **Skeleton Preview:** `/dev/skeletons` renders any route's skeleton on demand, since a real one
  flashes past in milliseconds. It is excluded from the sitemap, asks not to be indexed, and answers
  with a 404 outside development. It also carries the responses section, which is not a route
  skeleton but has states a skeleton cannot stand in for: loading, populated, fully loaded, empty and
  unreachable. Those are picked with `SubCategoryFilter` rather than stacked, so two of them can be
  compared in the same place on screen. Which skeleton is showing is held in state and written to the
  address with `history.replaceState`, so a pick swaps in place while a link to one still opens on it.
  `CategoryTransition` keys the skeleton by slug, which is what a plain anchor and its full reload
  used to buy: each pick mounts the placeholder afresh, so its pulses start together rather than
  picking up mid cycle from the last one. A skeleton half way through someone else's animation is not
  the thing being inspected.
- **Missing Media:** `MarqueeField` renders a tilted, scrolling `OOPS! NO IMAGE` plate wherever a
  project has no artwork to show. Each row holds two copies of its text and travels exactly half its
  own width, so the loop has no seam; the repeats are joined with a non-breaking space because a
  plain trailing space is dropped at the end of a flex item and would close the join. Rows alternate
  in weight and direction, and the field is oversized before it is tilted so rotation does not
  leave bare wedges at the corners.
- **Load Failure:** whether a project names artwork and whether that artwork resolves are separate
  questions, and only the first can be answered while rendering. `useMediaFallback` tracks the
  second per source, so a path that is renamed, moved or never committed degrades to the placeholder
  instead of a broken frame. A failing video falls through to the image before the placeholder. It
  also checks the element on mount, because a server-rendered image can finish failing before React
  hydrates and the `error` event it fired is gone by the time a handler exists.
- **Skeleton Pulse:** Placeholders pulse rather than sweep. `.animate-skeleton-pulse` in
  `src/app/globals.css` fades an overlay pseudo-element in and out, animating opacity alone so the
  work stays on the compositor. Fading an overlay rather than the block itself holds any ring around
  the block at a steady colour, and the overlay inherits the radius so it never squares off a rounded
  corner. Every placeholder shares one timing, so a page of them reads as a single surface breathing,
  and the animation is disabled under reduced motion.
- **Route-Level Streaming:** Next.js `loading.tsx` boundaries are implemented for all routes and subroutes (`/`, `/blogs`, `/blogs/[slug]`, `/projects`, `/projects/[slug]`, `/changelog`, `/message-board`, `/catalog`, `/skills`, `/links`, `/domains`, `/testimonials`, `/photos`, `/admin/newsletter`,
  `/unsubscribe`), precisely mirroring the exact typography, grid, and timeline layouts of the loaded pages to eliminate Cumulative Layout Shift (CLS).

## Audio

- Name pronunciation uses the custom `useSoundLazy` hook. It fetches and decodes the clip on hover,
  caches the resulting `AudioBuffer` and plays it through the shared Web Audio preference.
- Every other piece of UI feedback is synthesised at runtime with the Web Audio API. See the [Audio Feedback Design System](audio-design-system.md).
