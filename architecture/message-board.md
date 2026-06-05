# Message Board

The `/message-board` page lets visitors leave public messages, with a few protections built in.

## Spam Protection

- **Honeypot**: Hidden form fields are invisible to humans but tempting to bots. If a hidden field comes back filled, the message is silently dropped.
- **Rate Limiting**: Submissions are checked against the sender's IP address. Posting too quickly triggers a cooldown, shown as a timer on the submit button.

## Admin Access

- The message input doubles as a login field. Typing a specific command (e.g. `/admin <password>`) logs you in instead of posting a message.
- Once authenticated, admins can delete messages or reply to them directly from the UI.
