# UI & Animations

## Styling (Tailwind v4)

- Tailwind CSS v4 defines the whole design system in CSS through `@theme` and custom properties (colours are authored in `oklch`), so there is no large JavaScript config file.
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
- **Spotlight Card**: Cards track pointer velocity on hover. Moving fast brightens the spotlight and slowing down fades it out smoothly.
- **Smooth Layouts**: Filtered lists use Framer `layout` animations, so items tween to their new positions instead of jumping instantly.
- **Animated Tabs**: Tab groups (in blogs, projects and MDX) share a single sliding indicator through a common `layoutId`, so the highlight transitions between the active tab.

## Audio

- Name pronunciation uses the custom `useSoundLazy` hook. It fetches and decodes the clip on hover,
  caches the resulting `AudioBuffer` and plays it through the shared Web Audio preference.
- Every other piece of UI feedback is synthesised at runtime with the Web Audio API. See the [Audio Feedback Design System](audio-design-system.md).
