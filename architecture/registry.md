# Component Registry API

This site doubles as a hub for distributing UI components through the Shadcn CLI.

## How `/r/[slug]` Works

When someone runs `npx shadcn add [component]`, the CLI requests the code from our site. The API handles it in four steps:

1. It looks up the component's metadata from local data (`src/data/content/components-content.ts`).
2. It reads the actual React file (`.tsx`) directly from our local folders (`src/registry/` or `src/components/`).
3. It rewrites the import paths inside the code so it resolves correctly in the downloader's project.
4. It wraps everything in the JSON format the Shadcn CLI expects, including any required npm dependencies.

## Abuse Prevention

- We check the `User-Agent` to confirm a real CLI tool is making the request, not a random bot.
- Requests are cached in memory by IP address, so a CI/CD pipeline asking for the same component 50 times a minute only triggers the file reading work once.
