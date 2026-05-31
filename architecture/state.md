# State & Hooks

We avoid heavy state managers like Redux. Most state is handled by React hooks or the URL.

## URL State
For pages with filters or sorting (like the blogs or component lists), the current state is stored right in the URL search parameters (e.g., ?category=react&sort=newest).
- If you copy the link and send it to someone, they see exactly what you see.
- Because it's in the URL, the server can read it on the first load and render the correct data immediately.

## Custom Hooks
- **useInfiniteScroll**: Infinite scroll can cause issues if the scroll callback uses old data. We use a useRef trick to make sure the scroll event always uses the newest version of your data without restarting the scroll listener.
- **useAdmin**: This hook manages whether you are logged in as an admin. It listens to browser storage events, so if you log out in one tab, you instantly get logged out in all your other open tabs.
