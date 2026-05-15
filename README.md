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

The site URL used by OG metadata, sitemap, and robots.txt resolves in this order:

1. `NEXT_PUBLIC_SITE_URL` — explicit override
2. `VERCEL_PROJECT_PRODUCTION_URL` — your Vercel custom domain (auto-set, no config needed)
3. `VERCEL_URL` — the per-deployment `*.vercel.app` URL (fallback)
4. `http://localhost:3000` — local dev

If you've added a custom domain in Vercel, no env var setup is needed.

## Built With

Next.js · React · TypeScript · Tailwind CSS · Framer Motion · MDX · Biome · Lefthook
