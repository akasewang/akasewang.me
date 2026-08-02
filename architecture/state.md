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
- **`useAdmin`:** Reads the server-side admin session and synchronizes its status across components
  and tabs. The credential remains in an httpOnly cookie, and Server Actions validate the session
  for every privileged mutation.
- **`useContentListState`:** Provides category, search and view/date sorting for blog and project
  lists. It synchronizes URL parameters and prefetches view counts.
- **`useCategoryParam`:** Shares category-only URL state across catalog, skills and photos. The
  first configured category is the default and is omitted from the URL.
