# brand — AGENTS.md

> **Workflow rules:** see [`zeroroot-ai/.github` → `AGENTS.md`](https://github.com/zeroroot-ai/.github/blob/main/AGENTS.md) — canonical for branching / commits / PRs / releases / merging. Conventional Commits MANDATORY. Never push to main. Never force-push.

## TL;DR

`@zeroroot-ai/brand` (Elastic License 2.0, see [`LICENSE`](LICENSE)) — the
ZeroRoot design tokens: CSS custom properties (`src/css/tokens.css`,
`globals.css`), the self-hosted webfonts (`src/fonts/`, declared in
`src/css/fonts.css`), and the Tailwind `@theme` mapping. The TS/JS token
export is generated into `dist/` by `scripts/build.mjs`; there is no
checked-in `tokens.ts`. Consumed by `dashboard`, `www`, and `docs-site`.
Dependency-free plain Node scripts; a clean checkout with Node 20+ just works.

Elastic License 2.0 is source-available, not open source. Do not call this
package Apache, MIT, or open source.

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
- **The fonts are not ours.** Inter Tight and JetBrains Mono are SIL Open
  Font License 1.1, and this package republishes them on the public npm
  registry. OFL clause 2 makes the copyright notice and the license text a
  condition of that. Adding a family means adding its license text to
  `src/fonts/` and its entry to [`NOTICE`](NOTICE) in the same commit.
  `src/__tests__/fonts.test.mjs` fails the build if you do not.

## Links

- Org-level workflow: [`AGENTS.md`](https://github.com/zeroroot-ai/.github/blob/main/AGENTS.md)
- Third-party attribution: [`NOTICE`](NOTICE), [`src/fonts/Inter-Tight-OFL.txt`](src/fonts/Inter-Tight-OFL.txt), [`src/fonts/JetBrains-Mono-OFL.txt`](src/fonts/JetBrains-Mono-OFL.txt)
- Consumers: [`dashboard`](https://github.com/zeroroot-ai/dashboard), `www` (private since 2026-09-16), [`docs-site`](https://github.com/zeroroot-ai/docs-site)
