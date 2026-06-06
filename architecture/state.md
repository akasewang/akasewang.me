# State & Hooks

We avoid heavy state managers like Redux. Most state lives in React hooks or directly in the URL.

## URL State

For pages with filtering or sorting (blogs, component lists), the current state is stored in the URL's search params (e.g. `?category=react&sort=newest`).

- Copy the link, send it to someone and they see exactly what you see.
- Because the state is in the URL, the server can read it on first load and render the correct data immediately — no flicker.

## Custom Hooks

- **useInfiniteScroll**: A scroll callback can capture stale data in its closure. We use a `useRef` to always read the latest data inside the scroll handler, without tearing down and reattaching the listener.
- **useAdmin**: Tracks whether you're logged in as an admin. It listens for browser `storage` events, so logging out in one tab instantly logs you out in every other open tab.
