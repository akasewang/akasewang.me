BEGIN;

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
