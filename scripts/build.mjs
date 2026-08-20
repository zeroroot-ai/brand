#!/usr/bin/env node
/**
 * @zeroroot-ai/brand build script — zero external dependencies.
 *
 * src/css/tokens.css is the SINGLE SOURCE for every token value. This script
 * parses it and derives the JS/TS exports, so a color is written in exactly
 * one place. It used to carry its own copy of every value, which meant the
 * package held four transcriptions of the same palette (tokens.css,
 * globals.css, src/tokens.ts and this file) with nothing checking that they
 * agreed.
 *
 * Groups are read from the section banners in tokens.css, so adding a token
 * means adding a line to that file and nothing else.
 *
 * Produces dist/:
 *   tokens.css   — pure CSS custom properties, no Tailwind
 *   fonts.css    — @font-face rules for the self-hosted families
 *   globals.css  — full Tailwind 4 entry point (imports the two above)
 *   fonts/       — the woff2 files those @font-face rules point at
 *   marks/       — the brand marks, as currentColor SVG for inlining
 *   index.js     — ESM exports (ALL_TOKENS, PALETTE, SEMANTIC, …)
 *   index.cjs    — CJS wrapper
 *   index.d.ts   — TypeScript declarations
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");

mkdirSync(DIST, { recursive: true });
mkdirSync(join(DIST, "fonts"), { recursive: true });
mkdirSync(join(DIST, "marks"), { recursive: true });

// ---------------------------------------------------------------------------
// CSS + fonts — copy verbatim.
// ---------------------------------------------------------------------------

for (const file of ["tokens.css", "fonts.css", "globals.css"]) {
  copyFileSync(join(ROOT, "src/css", file), join(DIST, file));
  console.log(`  dist/${file}`);
}

for (const font of readdirSync(join(ROOT, "src/fonts"))) {
  copyFileSync(join(ROOT, "src/fonts", font), join(DIST, "fonts", font));
  console.log(`  dist/fonts/${font}`);
}

for (const mark of readdirSync(join(ROOT, "src/marks"))) {
  copyFileSync(join(ROOT, "src/marks", mark), join(DIST, "marks", mark));
  console.log(`  dist/marks/${mark}`);
}

// ---------------------------------------------------------------------------
// Parse tokens.css — the single source.
// ---------------------------------------------------------------------------

/** Section banner text → export group. Matched case-insensitively on a prefix. */
const SECTIONS = [
  ["Palette", "PALETTE"],
  ["Semantic", "SEMANTIC"],
  ["Specialty", "SPECIALTY"],
  ["Dracula", "DRACULA"],
  ["Typography", "TYPOGRAPHY"],
  ["Legacy", "LEGACY_ALIASES"],
];

const groups = {
  PALETTE: {},
  SEMANTIC: {},
  SPECIALTY: {},
  DRACULA: {},
  TYPOGRAPHY: {},
  LEGACY_ALIASES: {},
};

const css = readFileSync(join(ROOT, "src/css/tokens.css"), "utf8");
let current = null;

for (const rawLine of css.split("\n")) {
  const line = rawLine.trim();

  const banner = line.match(/^\/\*\s*([A-Za-z]+)/);
  if (banner) {
    const hit = SECTIONS.find(([label]) => banner[1].toLowerCase() === label.toLowerCase());
    if (hit) current = hit[1];
    continue;
  }

  const decl = line.match(/^--([a-z0-9-]+):\s*(.+?);\s*$/i);
  if (!decl) continue;
  if (!current) {
    throw new Error(`token --${decl[1]} appears before any section banner in tokens.css`);
  }
  groups[current][decl[1]] = decl[2].trim();
}

for (const [group, tokens] of Object.entries(groups)) {
  if (Object.keys(tokens).length === 0) {
    throw new Error(`no tokens parsed for ${group} — has a section banner in tokens.css been renamed?`);
  }
}

// The palette is exported as ramps, not a flat map, so PALETTE.base["500"]
// keeps working for consumers. Ramp membership comes from the token prefix.
const RAMPS = ["base", "primary", "secondary"];
const PALETTE = Object.fromEntries(RAMPS.map((r) => [r, {}]));
const PALETTE_FLAT = {};

for (const [name, value] of Object.entries(groups.PALETTE)) {
  const m = name.match(/^(base|primary|secondary)-(\d+)$/);
  if (!m) throw new Error(`palette token --${name} does not match <ramp>-<step>`);
  PALETTE[m[1]][m[2]] = value;
  PALETTE_FLAT[name] = value;
}

for (const ramp of RAMPS) {
  const steps = Object.keys(PALETTE[ramp]).length;
  if (steps !== 12) throw new Error(`PALETTE.${ramp} has ${steps} steps, expected 12`);
}

const { SEMANTIC, SPECIALTY, DRACULA, TYPOGRAPHY, LEGACY_ALIASES } = groups;

const ALL_TOKENS = {
  ...PALETTE_FLAT,
  ...SEMANTIC,
  ...SPECIALTY,
  ...DRACULA,
  ...TYPOGRAPHY,
  ...LEGACY_ALIASES,
};

const TOKEN_NAMES = Object.keys(ALL_TOKENS);

console.log(`  parsed ${TOKEN_NAMES.length} tokens from src/css/tokens.css`);

// ---------------------------------------------------------------------------
// Emit JS / TS.
// ---------------------------------------------------------------------------

const banner = "// @zeroroot-ai/brand — generated from src/css/tokens.css by scripts/build.mjs. Do not edit.";
const j = (v) => JSON.stringify(v, null, 2);

const decls = `export const PALETTE = ${j(PALETTE)};
export const SEMANTIC = ${j(SEMANTIC)};
export const SPECIALTY = ${j(SPECIALTY)};
export const DRACULA = ${j(DRACULA)};
export const TYPOGRAPHY = ${j(TYPOGRAPHY)};
export const LEGACY_ALIASES = ${j(LEGACY_ALIASES)};
export const ALL_TOKENS = ${j(ALL_TOKENS)};
export const TOKEN_NAMES = ${j(TOKEN_NAMES)};
`;

writeFileSync(join(DIST, "index.js"), `${banner}\n${decls}`);
console.log("  dist/index.js");

writeFileSync(
  join(DIST, "index.cjs"),
  `${banner}\n"use strict";\n${decls.replace(/^export const /gm, "const ")}
module.exports = { PALETTE, SEMANTIC, SPECIALTY, DRACULA, TYPOGRAPHY, LEGACY_ALIASES, ALL_TOKENS, TOKEN_NAMES };
`,
);
console.log("  dist/index.cjs");

writeFileSync(
  join(DIST, "index.d.ts"),
  `${banner}

export type PaletteRamp = "base" | "primary" | "secondary";
export type PaletteStep = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950" | "1000";

export declare const PALETTE: Record<PaletteRamp, Record<PaletteStep, string>>;
export declare const SEMANTIC: Record<string, string>;
export declare const SPECIALTY: Record<string, string>;
export declare const DRACULA: Record<string, string>;
export declare const TYPOGRAPHY: Record<string, string>;
export declare const LEGACY_ALIASES: Record<string, string>;
export declare const ALL_TOKENS: Record<string, string>;
export declare const TOKEN_NAMES: string[];
`,
);
console.log("  dist/index.d.ts");

console.log("\n@zeroroot-ai/brand build complete.");
