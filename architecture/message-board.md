# Message Board

The `/message-board` page lets visitors leave public messages through Server Actions and loads older
messages with cursor-based infinite scrolling.

Paging is by scroll only where the board fills its own page. A board sitting inside a page has a
footer under it, so loading on scroll would grow the section as fast as the reader moved through it
and put the end of the page permanently out of reach. Those boards wait to be asked, with a button.

## Boards

Every board shares one table and one set of actions, told apart by a `slug` column:

- The site-wide board at `/message-board` is the rows where `slug` is null. Null rather than a
  reserved value, so rows written before boards were scoped are already on the right one.
- A blog post or project carries its own board, keyed by the page's path (`blogs/<slug>`,
  `projects/<slug>`). Namespacing by section keeps a post and a project of the same name apart and
  makes a stored row readable at a glance.
- A project that sends readers to an external link generates no page here, so it has no board. This
  needs no condition: `getPageProjects` already excludes them, and it is the list pages are built
  from.

The key is validated on write against the real content directory. It arrives from the client, and
without the check a message could be filed against a page that was never written. That read happens
at request time inside the Server Action, long after the page was built, so `next.config.ts` names
`docs/` under `outputFileTracingIncludes` for the post routes. Without it the deployed bundle ships
without the content directory, the read comes back empty and every post to a post board is refused
while dev works perfectly.

A board is tied to the slug, so adding a post is all it takes for its board to exist. Removing or
renaming one leaves its messages in the table under the old key, where they are invisible, since no
page renders that board, and unwritable, since the key no longer names a page. Nothing is deleted,
and restoring the file under the same slug brings the board back with it.

A post's board is fetched on the client rather than rendered with the page. These pages are
prerendered, so a board rendered alongside one would be frozen at build time, and a build without a
reachable database would bake the offline notice into every post. The post stays static, the
discussion stays current.

That also decides what happens after a write. Only the site-wide board is revalidated, since only it
is rendered with its page; revalidating a post would discard a good static render to rebuild
identical HTML. A post's board reloads itself instead. It reads its first page and its total in one
call rather than two, and corrects the count itself when the owner deletes a message, the list
having already dropped it.

The owner signs in and out on `/message-board` only. The session is a cookie that every board reads,
so replies and deletions work under a post without a second way in.

## Spam Protection

- **Honeypot:** A hidden `honey` field rejects submissions when it is populated.
- **Input limits:** Names must contain 2–80 characters and messages 2–500 characters. A name shaped
  like an email address is refused: on the board's own page it means the owner is signing in and
  never reaches the insert, and under a post, where no sign in is offered, storing one would publish
  somebody's address for the sake of a mistyped field.
- **Rate limiting:** The action reads the first `x-forwarded-for` address, then `x-real-ip`, and
  atomically claims a two-minute cooldown keyed by an HMAC digest of the action and IP. The client
  uses the same duration in a status timer persisted across reloads and tabs. The cooldown is one
  per visitor across the whole site rather than one per board, so posting cannot be multiplied by
  moving between posts. The status timer shares a key for the same reason.

## Storage & Admin

- Messages persist to the Neon Postgres database through Drizzle, the same stack as the rest of the site.
- Raw IP addresses are not stored with messages. Pagination uses the numeric message id as a cursor
  and caps each server request. Messages are listed newest first, with older pages loading as the
  reader scrolls down.
- A reply is a column on the message rather than a second row, since there can only ever be one. It
  is stamped with `admin_reply_at` whenever it is written or edited, and the reply action returns
  that value so the board renders the time the row holds rather than the admin browser's clock. The
  reply bubble shows its own time, adding the day where the answer came on a later one. Replies
  written before the column existed have none and fall back to the message's time.
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
