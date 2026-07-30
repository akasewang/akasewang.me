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
- **Reduced Motion:** the same provider sets `MotionConfig reducedMotion="user"`, so every `m`
  component drops its positional animations (transforms, layout, width and height) when the OS asks
  for less motion, while opacity and colour still animate. Individual components therefore do not
  check the preference themselves. CSS transitions are outside that scope and opt out with
  `motion-reduce:transition-none`.
- **Spotlight Card**: Cards track pointer velocity on hover. Moving fast brightens the spotlight and slowing down fades it out smoothly.
- **Smooth Layouts**: Filtered lists use Framer `layout` animations, so items tween to their new positions instead of jumping instantly.
- **Animated Tabs**: Tab groups (in blogs, projects and MDX) share a single sliding indicator through a common `layoutId`, so the highlight transitions between the active tab.
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

## Audio

- Name pronunciation uses the custom `useSoundLazy` hook. It fetches and decodes the clip on hover,
  caches the resulting `AudioBuffer` and plays it through the shared Web Audio preference.
- Every other piece of UI feedback is synthesised at runtime with the Web Audio API. See the [Audio Feedback Design System](audio-design-system.md).
