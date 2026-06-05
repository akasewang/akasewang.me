# UI & Animations

## Styling (Tailwind v4)

- We use Tailwind CSS v4, which lets us define the design system entirely in CSS variables instead of a large JavaScript config file.
- **Custom Cursor**: The custom mouse cursor is driven by CSS variables. It is hardware-accelerated and noticeably faster than tracking mouse position through React state.

## Animations (Framer Motion)

- We use `framer-motion` for complex animations, and lazy-load the animation code so the initial page stays light for users on slow connections.
- **Spotlight Card**: Cards track your mouse speed on hover — moving fast brightens the spotlight, and slowing down fades it out smoothly.
- **Smooth Layouts**: When you filter a list, items animate into their new positions instead of jumping instantly.
- **Animated Tabs**: Tab groups (in blogs, projects, and the component registry) share a single sliding indicator that transitions between the active tab.

## Audio

- We use `use-sound` to play an audio clip of the name pronunciation. The file is fetched in the background on hover, so it plays instantly on click without slowing down the initial load.
