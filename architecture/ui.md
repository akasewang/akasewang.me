# UI & Animations

## Styling (Tailwind v4)

- Tailwind CSS v4 defines the whole design system in CSS through `@theme` and custom properties (colours are authored in `oklch`), so there is no large JavaScript config file.
- **Custom Cursor**: The cursor follows the pointer through CSS custom properties updated on `pointermove`, not React state. It stays on the compositor thread (hardware accelerated) and avoids a re-render per frame.
- **Dot Grid Background**: A full-viewport `<canvas>` draws a grid of dots displaced by 3D simplex noise (`DotGridBackground`). Each dot drifts smoothly over time, and opacity is modulated by the noise derivative to create a breathing effect. The grid rebuilds on resize and pauses when the tab is hidden. Users who prefer reduced motion get a single static frame.

## Animations (Framer Motion)

- A root `MotionProvider` wraps the app in `LazyMotion` with the `domMax` feature set in `strict` mode. Components use the lightweight `m` component (`m.div`), so the heavy animation engine is code split out of the initial bundle while still supporting `layout` and `layoutId`.
- **Spotlight Card**: Cards track pointer velocity on hover. Moving fast brightens the spotlight and slowing down fades it out smoothly.
- **Smooth Layouts**: Filtered lists use Framer `layout` animations, so items tween to their new positions instead of jumping instantly.
- **Animated Tabs**: Tab groups (in blogs, projects and MDX) share a single sliding indicator through a common `layoutId`, so the highlight transitions between the active tab.

## Audio

- Name pronunciation uses `use-sound`. The clip is fetched in the background on hover, so it plays instantly on click without slowing the initial load.
- Every other piece of UI feedback is synthesised at runtime with the Web Audio API. See the [Audio Feedback Design System](audio-design-system.md).
