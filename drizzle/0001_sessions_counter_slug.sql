-- Run by hand, not by db:push. Two earlier slugs counted the same thing and are folded into one
-- here, which is a move of data rather than a change of shape and so nothing push can work out.
BEGIN;

-- The higher of the two, since they overlapped and neither is the full count on its own
WITH legacy_counter AS (
  SELECT COALESCE(MAX("count"), 0) AS "count"
  FROM "views"
  WHERE "slug" IN ('_site_visitors', '_site_visits')
)
INSERT INTO "views" ("slug", "count")
SELECT '_sessions', "count"
FROM legacy_counter
WHERE "count" > 0
ON CONFLICT ("slug") DO UPDATE
SET "count" = GREATEST("views"."count", EXCLUDED."count");

DELETE FROM "views"
WHERE "slug" IN ('_site_visitors', '_site_visits');

COMMIT;
