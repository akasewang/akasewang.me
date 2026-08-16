# State & Hooks

The application avoids a global state-management library. State lives primarily in React hooks,
URL search parameters, context providers or short-lived browser storage.

## URL State

Blog and project filters store category, search text and sort order in URL search parameters (for
example, `?category=react&q=audio&sort=views-desc`). Catalog, skills and photos use the same
approach for category-only filters.

- Client list components read with `useSearchParams` inside `Suspense` boundaries. They update the
  address with `window.history.replaceState`, avoiding a navigation, history entry or scroll jump.
- Default category and sort values are omitted from the query string. Unknown values fall back to
  the configured defaults.
- Shared URLs preserve the selected filters when opened in another browser.

## Custom Hooks

- **`useInfiniteScroll`:** Wraps an `IntersectionObserver` around a sentinel with a default `400px`
  `rootMargin`. Its live callback is held in a ref, so callback changes do not recreate the
  observer.
- **`useViews` / `ViewsProvider`:** Batches and caches view-count reads. See the View Counter in the
  [overview](overview.md).
- **`useGithubStars`:** Reads from `/api/github-stars`, deduplicates concurrent callers with a
  module-level promise and caches valid counts in `localStorage` for 15 minutes.
- **`useStatusTimer`:** Holds success and error state and derives its countdown from an absolute
  expiry timestamp. Newsletter signup and message posting give it distinct storage keys, so their
  cooldown feedback survives reloads and synchronizes through browser `storage` events. This
  browser state is only feedback; the atomic Postgres cooldown remains authoritative.
- **`useAdmin`:** Reads the server-side admin session on mount and window focus, and refreshes
  same-tab consumers through an internal event after sign-in or sign-out. The credential remains in
  an httpOnly cookie, so client state contains only a boolean. Server Actions validate the database-
  backed session for every privileged mutation.
- **`useContentListState`:** Provides category, search and view/date sorting for blog and project
  lists. It synchronizes URL parameters and prefetches counts, taking each item's key from
  `countKeyFor` so a project that links away is prefetched and sorted on its visit count rather than
  on a page view count it can never accumulate.
- **`useVisits`:** Records an external project when a card or command result actually opens its
  destination; rendering either surface does not count. See the View Counter in the
  [overview](overview.md).
- **`useCategoryParam`:** Shares category-only URL state across catalog, skills and photos. The
  first configured category is the default and is omitted from the URL.
- **`useMediaFallback`:** Tracks whether a media file named in frontmatter actually loaded, which is
  a different question from whether one was named and cannot be answered while rendering. It resets
  during render when the source changes rather than in an effect, so a newly named source is never
  reported as failed before it has been tried, and it exposes a ref callback that checks the element
  on mount for images that finished failing before hydration attached a handler.
- **`useCursorParallax`:** Leans a hovered medium toward the cursor. Offsets are written to the
  element as custom properties and coalesced into an animation frame, so pointer movement re-renders
  nothing, and the drift is bounded by the hover zoom. See the Card Media Lean in the [UI
  notes](ui.md).
- **`useScrollOverflow`:** Attaches a callback ref to a scroll viewport, marks it only while content
  actually overflows and maintains the CSS mask variables required by browsers without scroll-driven
  animation timelines. Resize and mutation observers cover content and container changes; teardown
  removes observers, listeners and inline variables.
- **`useKeyboardShortcut`:** Registers one document listener for a key combination and reads the
  latest callback through an Effect Event. It ignores key repeat, IME composition and events already
  claimed by another interaction. The command menu uses it for Ctrl/Command+K without duplicating
  global listeners when state changes.
- **`usePageArriving` and `useArrivedWithPage`:** Both read the route-transition context, and the
  difference between them is when. `usePageArriving` follows it, so layout measurement, visibility
  observers and media playback can wait until the incoming page has settled instead of reacting to
  temporary translated geometry. `useArrivedWithPage` captures it once at mount, so an element that
  came in on a page slide stays put rather than animating itself again the moment the slide ends.
