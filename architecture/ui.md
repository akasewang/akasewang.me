# UI & Animations

## Styling (Tailwind v4)

- Tailwind CSS v4 defines the whole design system in CSS through `@theme` and custom properties (colours are authored in `oklch`), so there is no large JavaScript config file.
- **Transition property lists:** v4 writes `translate`, `scale` and `rotate` as their own CSS
  properties rather than folding them into `transform`, so a hand written
  `transition-[transform,...]` has to name each one it animates or that value snaps instead of
  moving. `transition-transform` covers all four.
- **Custom Cursor:** `src/app/cursor.css` defines data-URI cursors for default, pointer, text,
  loading, grab and zoom states. Cursor selection is entirely CSS-driven and does not add
  pointer-tracking React state.
- **Dot Grid Background:** A full-viewport `<canvas>` draws dots displaced by 3D simplex noise.
  Opacity varies with the generated movement direction. The grid rebuilds on resize, pauses while
  the document is hidden and renders a single frame for reduced-motion users.

## Animations (Framer Motion)

- A root `MotionProvider` wraps the app in `LazyMotion` with the synchronous `domMax` feature set and
  strict mode. Components use the `m` API consistently while retaining `layout` and `layoutId`
  support; `domMax` is bundled rather than loaded through an asynchronous feature loader.
- **Reduced Motion:** the provider sets `MotionConfig reducedMotion="user"`, which handles
  declarative `m` transform and layout motion. Imperative animation paths and non-Motion CSS or
  canvas effects handle the preference separately through `prefersReducedMotion` in
  `src/utils/motion.ts`: the highlight box, the cursor lean and the dot grid all read it, CSS
  transitions and keyframes use `motion-reduce:*`, and the marquee plates are stilled by a rule in
  `globals.css`. The helper caches the `MediaQueryList` rather than its answer, since it is called
  per pointer move and a live query keeps reporting the current preference without a subscription.
- **Spotlight Card**: Cards track pointer velocity on hover. Moving fast brightens the spotlight and slowing down fades it out smoothly.
- **Card Media Lean:** a project card's medium lifts on hover and leans toward the cursor.
  `useCursorParallax` writes the offset to the card as custom properties and coalesces moves into an
  animation frame, so pointer movement re-renders nothing. The zoom is what makes the lean possible:
  a medium already fills its frame exactly and has nowhere to move until the scale grows it past the
  edges, so the drift is expressed as a fraction of the card (`0.012`) against the slack the zoom
  opens (half of `0.03`). A fixed pixel offset would hold on a wide card and slide off a short one.
  Both halves are gated on `supports-hover` alone with no breakpoint attached, since attaching a
  width to one and not the other lets a narrowed desktop window lean a medium with nothing grown to
  lean into.
- **Smooth Layouts**: Filtered lists use Framer `layout` animations, so items tween to their new positions instead of jumping instantly.
- **Animated Filters and MDX Tabs:** Category filters, including blog and project filters, use a
  per-instance `layoutId` to slide the active background. MDX tabs use overlapping notebook-style
  controls that shift on hover or press and directionally swap a height-measured panel; they do not
  use the shared indicator.
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
- **Action Button State:** The shared `Button` re-keys its label and right-hand status segment when
  the default, pending, success or cooldown face changes. Each outgoing face moves upward while its
  replacement enters from below inside an overflow-clipped grid, matching the arrow motion. The
  button deliberately changes width immediately; there is no width or layout animation when labels
  have different lengths.

## Loading Skeletons & Transitions

- **Reusable Skeleton:** `src/components/ui/skeleton.tsx` provides a zero-dependency, accessible placeholder primitive.
- **Card and Skeleton Ratio:** `PROJECT_CARD_ASPECT` and `PROJECT_GRID_CLASS` live beside the
  skeleton and are read by the card, so the placeholder and the thing it stands in for cannot drift
  into different sizes and make the grid jump as one swaps for the other.
- **Missing Media:** `MarqueeField` renders a tilted, scrolling plate used wherever a project has no
  artwork to show: `COMING SOON` for work marked `preview`, and `OOPS! NO IMAGE` when a source is
  absent or fails to load. Each row holds two copies of its text and travels exactly half its own
  width, so the loop has no seam; the repeats are joined with a non-breaking space because a plain
  trailing space is dropped at the end of a flex item and would close the join. Rows alternate in
  weight and direction, and the field is oversized before it is tilted so rotation does not leave
  bare wedges at the corners.
- **Load Failure:** whether a project names artwork and whether that artwork resolves are separate
  questions, and only the first can be answered while rendering. `useMediaFallback` tracks the
  second per source, so a path that is renamed, moved or never committed degrades to the placeholder
  instead of a broken frame. A failing video falls through to the image before the placeholder. It
  also checks the element on mount, because a server-rendered image can finish failing before React
  hydrates and the `error` event it fired is gone by the time a handler exists.
- **Hardware-Accelerated Shimmer:** Shimmer effects use 3D CSS transforms (`translate3d`), `will-change: transform`, and `isolation: isolate` in `src/app/globals.css` to prevent layout thrashing and maintain 60fps GPU acceleration.
- **Route-Level Streaming:** Next.js `loading.tsx` boundaries are implemented for all routes and subroutes (`/`, `/blogs`, `/blogs/[slug]`, `/projects`, `/projects/[slug]`, `/changelog`, `/message-board`, `/catalog`, `/skills`, `/testimonials`, `/photos`, `/newsletter`, `/admin/newsletter`, `/unsubscribe`), precisely mirroring the exact typography, grid, and timeline layouts of the loaded pages to eliminate Cumulative Layout Shift (CLS).

## Audio

- Name pronunciation uses the custom `useSoundLazy` hook. It fetches and decodes the clip on hover,
  caches the resulting `AudioBuffer` and plays it through the shared Web Audio preference.
- Every other piece of UI feedback is synthesised at runtime with the Web Audio API. See the [Audio Feedback Design System](audio-design-system.md).

