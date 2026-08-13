# brand — AGENTS.md

> **Workflow rules:** see [`zeroroot-ai/.github` → `AGENTS.md`](https://github.com/zeroroot-ai/.github/blob/main/AGENTS.md) — canonical for branching / commits / PRs / releases / merging. Conventional Commits MANDATORY. Never push to main. Never force-push.

## TL;DR

`@zeroroot-ai/brand` (Apache-2.0) — the ZeroRoot design tokens: CSS
custom properties (`src/css/tokens.css`, `globals.css`), the TS token
export (`src/tokens.ts`), and the Tailwind `@theme` mapping. Consumed by
`dashboard`, `www`, and `docs-site`. Dependency-free plain Node scripts;
a clean checkout with Node 20+ just works.

## Commands

```bash
make build   # compile tokens -> dist/ (ESM + CJS + d.ts + CSS)
make test    # node --test src/__tests__/
make check   # build then test (mirrors CI exactly)
```

## Gotchas

- **Single locked dark aesthetic — there is NO light mode.** The token
  set is violet-led, near-black, cyan-blue links, CRT scanline overlay.
  Do not add light-mode variants or `prefers-color-scheme` branches
  here; consumers are dark-only by design.
- **Never reference the raw palette ramps from components** — the ramp
  variables (`--base-*`, etc.) are documented as internal; components
  use the semantic tokens layered on top.
- Changing a token changes three deployed surfaces at once (dashboard,
  www, docs-site). Treat token edits as copy/brand changes: propose,
  don't unilaterally reship the look.

## Links

- Org-level workflow: [`AGENTS.md`](https://github.com/zeroroot-ai/.github/blob/main/AGENTS.md)
- Consumers: [`dashboard`](https://github.com/zeroroot-ai/dashboard), [`www`](https://github.com/zeroroot-ai/www), [`docs-site`](https://github.com/zeroroot-ai/docs-site)
