-- Run by hand, not by db:push. push diffs the schema against the database and would read a rename
-- as a drop and a create, taking every message with it, so the rename was made here first.
ALTER TABLE "guestbook" RENAME TO "message_board";
