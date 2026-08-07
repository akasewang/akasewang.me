# Newsletter & Admin Access

Newsletter signup, unsubscribe, admin authentication, broadcast delivery and the scheduled summary
share Neon Postgres and Resend, but each has a separate entry point and failure policy.

## Public Subscription

- `subscribeAction` trims and lowercases the address, enforces the shared email shape and caps it at
  254 characters before touching the database.
- The server atomically claims a 60-second `newsletter-subscribe` cooldown using an HMAC of the
  action and client IP. The raw IP is never written. A matching `useStatusTimer` deadline gives the
  browser persistent feedback across reloads and tabs, but is not the security control.
- Email is the subscriber table's primary key. New inserts use `ON CONFLICT DO NOTHING`, and an
  inactive subscriber is reactivated only through a conditional update, so concurrent requests
  cannot create duplicates or send more than one welcome email for the winning transition.
- Reactivation preserves the subscriber's UUID token, keeping older unsubscribe links valid. Its
  `createdAt` value is refreshed so the address appears in that week's summary.
- The database write is the source of truth. Welcome-email failures are logged after the signup and
  do not turn a successful subscription into a failure response.

## Unsubscribe

- `/unsubscribe/[token]` calls `unsubscribeAction`, which validates the UUID shape before comparing
  it with the Postgres UUID column. Malformed and unknown tokens therefore return `invalid` instead
  of becoming database errors.
- Unsubscribing flips `isActive` rather than deleting the row. Broadcasts and weekly summaries query
  active subscribers only.

## Admin Authentication

- Admin access no longer accepts a password or command prefix. A request for the configured admin
  address mails an eight-character code to `RESEND_ADMIN_EMAIL`, sent from `RESEND_OTP_EMAIL`.
- Only a SHA-256 hash of the code is stored in `admin_otp`. A code lasts ten minutes, permits up to
  five failed guesses and can be reissued after a 60-second cooldown, retiring the previous code.
- A valid code creates a random 32-byte browser token. Only its hash and one-hour expiry are stored
  in `admin_session`; the token itself is held in an httpOnly, same-site cookie that is secure in
  production.
- The code stays valid until expiry or the failed-attempt ceiling rather than being consumed after
  its first successful exchange. Each privileged mutation independently checks the current session.
  Signing out deletes its database row as well as its cookie, making logout immediately revocable.
- The message board requests the code from the name field and accepts it from the message field. The
  admin newsletter form uses dedicated email and code inputs. Authentication values return before
  either public-content action runs, so they are not stored as messages or subscribers.

## Broadcast Delivery

- `broadcastNewsletter` requires a valid admin session and sends only to active subscribers using `RESEND_NEWSLETTER_EMAIL`.
- The post template is rendered once with an unsubscribe placeholder. `replaceAll` substitutes each
  subscriber's stable token, including every occurrence if the template contains more than one
  unsubscribe link.
- Resend payloads are built for the current batch only. Batches contain at most 100 messages and
  begin 550 ms apart, staying just below the provider limit of two requests per second without
  retaining a full list's rendered payloads in memory.
- If Resend returns an error for a batch, the action reports how many earlier recipients were sent
  and stops. Unexpected exceptions are logged and return the general broadcast error.
- Email date formatting ignores malformed dates instead of throwing a `RangeError` that would abort
  the entire broadcast. The newsletter template's editorial body copy is shared by every post;
  post-specific title, excerpt, date, reading time and links are passed in separately.

## Weekly Summary & Operations

- Vercel calls `/api/cron/weekly-summary` every Sunday at `09:00 UTC`. The route refuses requests
  unless `Authorization` exactly matches `Bearer <CRON_SECRET>` and sends active addresses created
  or reactivated during the previous seven days to `RESEND_ADMIN_EMAIL`, including summaries whose count
  is zero.
- The same job deletes expired `action_rate_limit` rows. These rows contain action-scoped HMAC
  digests rather than raw IP addresses and otherwise have no value after expiry.
- Deploying this design requires `npm run db:push` for `admin_otp`, `admin_session` and
  `action_rate_limit`, plus independent `RATE_LIMIT_SECRET` and `CRON_SECRET` values. Generation
  commands and the complete environment table are in the [README](../README.md#environment-variables).
