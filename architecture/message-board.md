# Message Board

The `/message-board` page lets visitors leave public messages through Server Actions and loads older
messages with cursor-based infinite scrolling.

## Spam Protection

- **Honeypot:** A hidden `honey` field rejects submissions when it is populated.
- **Input limits:** Names must contain 2–80 characters and messages 2–500 characters.
- **Rate limiting:** The action reads the first `x-forwarded-for` address, then `x-real-ip`, and
  rejects another message from that IP within two minutes. The client uses a five-minute status
  timer after successful or rate-limited attempts to discourage immediate retries.

## Storage & Admin

- Messages persist to the Neon Postgres database through Drizzle, the same stack as the rest of the site.
- Public reads exclude the stored IP address. Pagination uses the numeric message id as a cursor and
  caps each server request.
- The message input doubles as an admin command field. `/admin <password>` stores the supplied
  credential in browser storage; it does not create a server session.
- Delete and reply Server Actions compare that credential with the server-only `ADMIN_PASSWORD` on
  every mutation. Invalid credentials cannot modify data even if the browser UI shows admin mode.
- `useAdmin` mirrors the locally stored credential across components and tabs (see
  [State & Hooks](state.md)). `/logout` removes it from browser storage.
