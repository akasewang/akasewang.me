# Component Registry API

This site also acts as a hub to distribute UI components using the Shadcn CLI.

## How /r/[slug] Works
When you run 
px shadcn add [component], the CLI asks our site for the code. Here is how the API handles it:
1. It looks up the component details from our local data (src/data/content/components-content.ts).
2. It reads the actual React file (.tsx) directly from our local folders (src/registry/ or src/components/).
3. It fixes the import paths inside the code so it works in the downloader's project.
4. It wraps everything into a JSON format that the Shadcn CLI expects, including any required npm packages.

## Abuse Prevention
- We check the User-Agent to make sure actual CLI tools are making the request, not random bots.
- We cache requests in memory by IP address so if a CI/CD pipeline requests the same component 50 times in a minute, we don't do the file-reading work 50 times.
