# Message Board

The /message-board page lets visitors leave public messages, with a few protections built in.

## Spam Protection
- **Honeypot**: There are hidden form fields that humans can't see but bots try to fill out. If a hidden field is filled, the message is ignored.
- **Rate Limiting**: The database checks your IP address. If you try to post too many messages too fast, it blocks you and shows a cooldown timer on the submit button.

## Admin Access
- The message input doubles as a login field. If you type a specific command (like /admin password), it logs you in instead of posting the message.
- Once logged in, admins can delete messages or reply to them directly from the UI.
