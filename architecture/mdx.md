# MDX & Content Parsing

All blogs, projects, and component docs are written in MDX (Markdown with React components).

## Parsing Content
- We use mdx-manager.ts to read the .mdx files directly from the file system. 
- We use s.readFileSync because reading local files is fast enough that asynchronous reading doesn't add any real benefit for this specific use case.
- The frontmatter (title, date, etc.) is validated to make sure there are no typos or missing fields.

## React in Markdown
- We use 
ext-mdx-remote to turn Markdown text into HTML.
- In mdx-config.tsx, we swap out standard HTML tags for our custom Tailwind components (e.g., swapping <a> for our custom <LinkText>).
- This also lets us drop complex React components directly into a .mdx file.

## Table of Contents
- When parsing MDX, we automatically find all headings (<h1> to <h6>) and give them clickable anchor links.
- The sidebar component reads these headings and highlights whichever section you are currently looking at on the screen.
