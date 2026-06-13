# Message Board

The `/message-board` page lets visitors leave public messages through a Server Action, with a few protections built in.

## Spam Protection

- **Honeypot**: A hidden form field, invisible to humans but tempting to bots. If it comes back filled, the action silently drops the message.
- **Rate Limiting**: The action reads the sender IP from the `x-forwarded-for` header and rejects a post if that IP submitted too recently. The cooldown is shown as a timer on the submit button.

## Storage & Admin

- Messages persist to the Neon Postgres database through Drizzle, the same stack as the rest of the site.
- The message input doubles as a login field. Typing a command (e.g. `/admin <password>`) authenticates instead of posting a message.
- Auth state is mirrored across tabs by `useAdmin` (see [State & Hooks](state.md)). Once authenticated, admins can delete messages or reply to them directly from the UI.
