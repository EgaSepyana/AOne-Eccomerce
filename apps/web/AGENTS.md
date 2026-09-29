<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

- After modifying any UI (component, style, layout, animation), do NOT run Playwright/browser screenshot tests to verify visually. The user tests manually in their own browser. Just verify with `tsc --noEmit`, `eslint`, and `bun run build`, then let the user know it's ready to check.
- Whenever you are unfamiliar with a library, framework, or API (including ones you think you know but that may have changed — e.g. Next.js, Elysia, Bun, Vercel config), ALWAYS use the Context7 MCP tool before writing code: call `resolve-library-id` to find the correct library, then `query-docs` to fetch up-to-date documentation. Never rely solely on training data for library-specific syntax, config, or setup steps.
