#!/usr/bin/env node
/**
 * @zeroroot/brand build script — zero external dependencies.
 *
 * Produces dist/:
 *   tokens.css   — pure CSS custom properties, no Tailwind
 *   globals.css  — full Tailwind 4 entry point (tokens + @theme + utilities)
 *   index.js     — ESM JS exports (ALL_TOKENS, PALETTE, SEMANTIC, …)
 *   index.cjs    — CJS wrapper
 *   index.d.ts   — TypeScript declarations
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");

mkdirSync(DIST, { recursive: true });

// CSS files — copy verbatim.
copyFileSync(join(ROOT, "src/css/tokens.css"), join(DIST, "tokens.css"));
copyFileSync(join(ROOT, "src/css/globals.css"), join(DIST, "globals.css"));
console.log("  dist/tokens.css");
console.log("  dist/globals.css");

// ---------------------------------------------------------------------------
// JS / TS — emit static data directly (no TS compiler needed).
// ---------------------------------------------------------------------------

const PALETTE_BASE = {
  "base-50":   "oklch(0.985 0.004 280)",
  "base-100":  "oklch(0.945 0.008 280)",
  "base-200":  "oklch(0.875 0.012 280)",
  "base-300":  "oklch(0.770 0.016 280)",
  "base-400":  "oklch(0.620 0.020 280)",
  "base-500":  "oklch(0.480 0.022 280)",
  "base-600":  "oklch(0.380 0.022 280)",
  "base-700":  "oklch(0.300 0.020 280)",
  "base-800":  "oklch(0.235 0.018 280)",
  "base-900":  "oklch(0.175 0.014 280)",
  "base-950":  "oklch(0.130 0.012 280)",
  "base-1000": "oklch(0.090 0.010 280)",
};

const PALETTE_PRIMARY = {
  "primary-50":   "oklch(0.970 0.020 295)",
  "primary-100":  "oklch(0.935 0.045 295)",
  "primary-200":  "oklch(0.880 0.090 295)",
  "primary-300":  "oklch(0.800 0.150 295)",
  "primary-400":  "oklch(0.700 0.205 295)",
  "primary-500":  "oklch(0.620 0.230 295)",
  "primary-600":  "oklch(0.560 0.220 295)",
  "primary-700":  "oklch(0.480 0.185 295)",
  "primary-800":  "oklch(0.410 0.150 295)",
  "primary-900":  "oklch(0.355 0.120 295)",
  "primary-950":  "oklch(0.260 0.085 295)",
  "primary-1000": "oklch(0.185 0.060 295)",
};

const PALETTE_SECONDARY = {
  "secondary-50":   "oklch(0.980 0.014 235)",
  "secondary-100":  "oklch(0.950 0.034 235)",
  "secondary-200":  "oklch(0.905 0.064 235)",
  "secondary-300":  "oklch(0.845 0.104 235)",
  "secondary-400":  "oklch(0.780 0.140 235)",
  "secondary-500":  "oklch(0.710 0.150 235)",
  "secondary-600":  "oklch(0.610 0.130 235)",
  "secondary-700":  "oklch(0.515 0.105 235)",
  "secondary-800":  "oklch(0.440 0.085 235)",
  "secondary-900":  "oklch(0.390 0.070 235)",
  "secondary-950":  "oklch(0.295 0.055 235)",
  "secondary-1000": "oklch(0.210 0.040 235)",
};

const PALETTE = {
  base: Object.fromEntries(
    Object.entries(PALETTE_BASE).map(([k, v]) => [k.replace("base-", ""), v])
  ),
  primary: Object.fromEntries(
    Object.entries(PALETTE_PRIMARY).map(([k, v]) => [k.replace("primary-", ""), v])
  ),
  secondary: Object.fromEntries(
    Object.entries(PALETTE_SECONDARY).map(([k, v]) => [k.replace("secondary-", ""), v])
  ),
};

const SEMANTIC = {
  "background":                  "oklch(0.17 0.012 280)",
  "foreground":                  "oklch(0.96 0.008 280)",
  "card":                        "oklch(0.21 0.014 280)",
  "card-foreground":             "oklch(0.96 0.008 280)",
  "popover":                     "oklch(0.21 0.014 280)",
  "popover-foreground":          "oklch(0.96 0.008 280)",
  "primary":                     "oklch(0.58 0.225 295)",
  "primary-foreground":          "oklch(0.99 0.004 295)",
  "secondary":                   "oklch(0.30 0.040 250)",
  "secondary-foreground":        "oklch(0.96 0.008 280)",
  "muted":                       "oklch(0.255 0.016 280)",
  "muted-foreground":            "oklch(0.76 0.020 280)",
  "accent":                      "oklch(0.275 0.022 288)",
  "accent-foreground":           "oklch(0.96 0.008 280)",
  "destructive":                 "oklch(0.54 0.210 22)",
  "destructive-foreground":      "oklch(0.99 0.004 22)",
  "error-text":                  "oklch(0.74 0.165 22)",
  "warning":                     "oklch(0.80 0.155 85)",
  "warning-foreground":          "oklch(0.20 0.030 85)",
  "success-foreground":          "oklch(0.18 0.030 162)",
  "overlay":                     "oklch(0.05 0.010 280 / 0.75)",
  "border":                      "oklch(0.34 0.020 280)",
  "input":                       "oklch(0.50 0.024 280)",
  "ring":                        "oklch(0.62 0.230 295)",
  "chart-1":                     "oklch(0.62 0.230 295)",
  "chart-2":                     "oklch(0.74 0.160 162)",
  "chart-3":                     "oklch(0.78 0.150 235)",
  "chart-4":                     "oklch(0.80 0.160 85)",
  "chart-5":                     "oklch(0.62 0.215 22)",
  "radius":                      "0.40rem",
  "sidebar":                     "oklch(0.19 0.013 280)",
  "sidebar-foreground":          "oklch(0.96 0.008 280)",
  "sidebar-primary":             "oklch(0.58 0.225 295)",
  "sidebar-primary-foreground":  "oklch(0.99 0.004 295)",
  "sidebar-accent":              "oklch(0.275 0.022 288)",
  "sidebar-accent-foreground":   "oklch(0.96 0.008 280)",
  "sidebar-border":              "oklch(0.32 0.020 280)",
  "sidebar-ring":                "oklch(0.62 0.230 295)",
};

const SPECIALTY = {
  "highlight":        "oklch(0.68 0.255 295)",
  "alt":              "oklch(0.76 0.170 162)",
  "link":             "oklch(0.80 0.160 235)",
  "glow-strength":    "0.9",
  "scanline-opacity": "0.035",
  "scanline-color":   "oklch(0.62 0.230 295)",
  "terminal-bg":      "oklch(0.090 0.010 280)",
};

const DRACULA = {
  "dracula-fg":      "#f8f8f2",
  "dracula-comment": "#6272a4",
  "dracula-cyan":    "#8be9fd",
  "dracula-green":   "#50fa7b",
  "dracula-orange":  "#ffb86c",
  "dracula-pink":    "#ff79c6",
  "dracula-purple":  "#bd93f9",
  "dracula-red":     "#ff5555",
  "dracula-yellow":  "#f1fa8c",
};

const TYPOGRAPHY = {
  "display-family": '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  "display-weight": "800",
  "text-family":    '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
};

const LEGACY_ALIASES = {
  "color-zd-bg":            "oklch(0.17 0.012 280)",
  "color-zd-bg-deep":       "oklch(0.21 0.014 280)",
  "color-zd-fg":            "oklch(0.96 0.008 280)",
  "color-zd-highlight":     "oklch(0.68 0.255 295)",
  "color-zd-alt":           "oklch(0.76 0.170 162)",
  "color-zd-link":          "oklch(0.80 0.160 235)",
  "color-zd-border":        "oklch(0.34 0.020 280)",
  "color-zd-accent-purple": "oklch(0.58 0.225 295)",
  "color-zd-accent-orange": "oklch(0.80 0.155 85)",
};

const ALL_TOKENS = {
  ...PALETTE_BASE,
  ...PALETTE_PRIMARY,
  ...PALETTE_SECONDARY,
  ...SEMANTIC,
  ...SPECIALTY,
  ...DRACULA,
  ...TYPOGRAPHY,
  ...LEGACY_ALIASES,
};

const TOKEN_NAMES = Object.keys(ALL_TOKENS);

// ESM
const esm = `// @zeroroot/brand — generated by scripts/build.mjs. Do not edit.
export const PALETTE = ${JSON.stringify(PALETTE, null, 2)};
export const SEMANTIC = ${JSON.stringify(SEMANTIC, null, 2)};
export const SPECIALTY = ${JSON.stringify(SPECIALTY, null, 2)};
export const DRACULA = ${JSON.stringify(DRACULA, null, 2)};
export const TYPOGRAPHY = ${JSON.stringify(TYPOGRAPHY, null, 2)};
export const LEGACY_ALIASES = ${JSON.stringify(LEGACY_ALIASES, null, 2)};
export const ALL_TOKENS = ${JSON.stringify(ALL_TOKENS, null, 2)};
export const TOKEN_NAMES = ${JSON.stringify(TOKEN_NAMES)};
`;

writeFileSync(join(DIST, "index.js"), esm);
console.log("  dist/index.js");

// CJS
const cjs = `// @zeroroot/brand — generated by scripts/build.mjs. Do not edit.
"use strict";
const PALETTE = ${JSON.stringify(PALETTE, null, 2)};
const SEMANTIC = ${JSON.stringify(SEMANTIC, null, 2)};
const SPECIALTY = ${JSON.stringify(SPECIALTY, null, 2)};
const DRACULA = ${JSON.stringify(DRACULA, null, 2)};
const TYPOGRAPHY = ${JSON.stringify(TYPOGRAPHY, null, 2)};
const LEGACY_ALIASES = ${JSON.stringify(LEGACY_ALIASES, null, 2)};
const ALL_TOKENS = ${JSON.stringify(ALL_TOKENS, null, 2)};
const TOKEN_NAMES = ${JSON.stringify(TOKEN_NAMES)};
module.exports = { PALETTE, SEMANTIC, SPECIALTY, DRACULA, TYPOGRAPHY, LEGACY_ALIASES, ALL_TOKENS, TOKEN_NAMES };
`;

writeFileSync(join(DIST, "index.cjs"), cjs);
console.log("  dist/index.cjs");

// TypeScript declarations
const dts = `// @zeroroot/brand — generated by scripts/build.mjs. Do not edit.

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
`;

writeFileSync(join(DIST, "index.d.ts"), dts);
console.log("  dist/index.d.ts");

console.log("\n@zeroroot/brand build complete.");
