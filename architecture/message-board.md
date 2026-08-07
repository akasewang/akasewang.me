# Message Board

The `/message-board` page lets visitors leave public messages through Server Actions and loads older
messages with cursor-based infinite scrolling.

## Spam Protection

- **Honeypot:** A hidden `honey` field rejects submissions when it is populated.
- **Input limits:** Names must contain 2–80 characters and messages 2–500 characters.
- **Rate limiting:** The action reads the first `x-forwarded-for` address, then `x-real-ip`, and
  atomically claims a two-minute cooldown keyed by an HMAC digest of the action and IP. The client
  uses the same duration in a status timer persisted across reloads and tabs.

## Storage & Admin

- Messages persist to the Neon Postgres database through Drizzle, the same stack as the rest of the site.
- Raw IP addresses are not stored with messages. Pagination uses the numeric message id as a cursor
  and caps each server request.
- Entering the configured admin email in the name input requests a short-lived eight-character
  code. After that request in the same browser flow, a matching code entered in the message input is
  validated to create a server-side session. The email and code are sent only to authentication
  Server Actions and are never inserted into or published on the message board. The code is valid
  for ten minutes with at most five failed guesses and stays usable during that window so the same
  sign-in flow can be completed from another admin surface.
- The session is represented by an httpOnly cookie backed by a hashed, expiring database record.
  Delete and reply Server Actions verify that session before every privileged mutation.
- `useAdmin` refreshes same-tab admin UI immediately and rechecks the shared cookie when another tab
  is focused (see [State & Hooks](state.md)). The visible **Leave Admin Mode** button deletes the
  database session and clears its cookie.
