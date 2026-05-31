# UI & Animations

## Styling (Tailwind v4)
- We use Tailwind CSS v4, which allows us to define our design system purely in CSS variables instead of a large JavaScript config file.
- **Custom Cursor**: We built a custom mouse cursor using CSS variables. It is hardware-accelerated and much faster than using React state to track mouse position.

## Animations (Framer Motion)
- We use ramer-motion for complex animations.
- **Spotlight Card**: Cards have a hover effect that tracks your mouse speed. Moving fast makes the spotlight brighter, and slowing down fades it out smoothly.
- **Smooth Layouts**: When you filter a list, the items smoothly slide into their new positions instead of instantly jumping.
- We lazy-load the animation code so the page loads faster for users on slow connections.

## Audio
- We use use-sound to play an audio file of name pronunciation. The audio is loaded in the background only when you hover over the button, so it plays instantly when clicked without slowing down the initial page load.
