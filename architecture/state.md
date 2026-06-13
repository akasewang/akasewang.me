# State & Hooks

We avoid heavy state managers like Redux. Most state lives in React hooks, the URL, or short lived browser storage.

## URL State

For pages with filtering or sorting (blogs, projects, catalog), the active state lives in the URL's search params (e.g. `?category=react&sort=newest`).

- Reads use `useSearchParams`. Updates that should not push a history entry use `window.history.replaceState`, so changing a filter syncs the URL without a navigation or a scroll jump.
- Because the state is in the URL, a Server Component reads it on first load and renders the correct data immediately, with no client side flicker.
- Copy the link, send it to someone and they see exactly what you see.

## Custom Hooks

- **useInfiniteScroll**: Wraps an `IntersectionObserver` on a sentinel element with a `400px` `rootMargin`, so the next page is requested before the trigger scrolls into view. The live `onIntersect` callback is held in a `useRef` and read inside the observer, so a changing callback never tears down and reattaches the observer.
- **useViews / ViewsProvider**: Batches and caches view count reads. See the View Counter in the [overview](overview.md).
- **useGithubStars**: Reads the star count from the internal `/api/github-stars` proxy, dedupes concurrent callers with a module level shared promise, and caches in `localStorage` for 15 minutes so repeat visits paint instantly.
- **useAdmin**: Tracks admin auth and listens for the browser `storage` event, so logging out in one tab instantly logs you out in every other open tab.
