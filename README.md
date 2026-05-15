# Personal Website v3

## Pages

- **/** — Landing page with work history, stats, and project gallery
- **/about** — About me
- **/blog** — Blog posts written in MDX
- **/portfolio** — Project showcase with detail pages

## Getting Started

```bash
pnpm i
pnpm dev
```

`pnpm i` also installs the git hooks via `lefthook install` (see `lefthook.yml`).

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — biome check (CI gate)
- `pnpm fix` — biome check with auto-fix
- `pnpm format` — biome formatter only

## Project structure

```
src/
  app/              # Next.js App Router routes (incl. sitemap.ts, robots.ts)
  components/       # Reusable UI primitives (Section, MaskIcon, etc.)
  components/ui/    # shadcn-style primitives (Button)
  sections/         # Page-level section compositions
  content/          # Blog MDX files — filename becomes the slug
  data/             # Static, typed content (portfolio, work history, etc.)
  lib/              # Shared helpers (motion constants, site URL, blog loader)
```

Blog posts live at `src/content/*.mdx` — the filename becomes the slug, and each post exports `metadata` (typed via `defineBlogPostMetadata`) plus a default MDX component.

## Environment

Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://noahjoeris.com`) so OG metadata, sitemap, and robots.txt resolve to absolute URLs. Falls back to `VERCEL_URL`, then `http://localhost:3000`.

## Built With

Next.js · React · TypeScript · Tailwind CSS · Framer Motion · MDX · Biome · Lefthook
