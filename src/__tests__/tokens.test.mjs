/**
 * @zeroroot/brand — token export tests.
 *
 * Runs against the built dist/index.js.
 * Run: node --test src/__tests__/tokens.test.mjs
 * (build first: node scripts/build.mjs)
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "../../dist/index.js");

if (!existsSync(DIST)) {
  console.log("SKIP: dist/index.js not found — run 'node scripts/build.mjs' first.");
  process.exit(0);
}

const brand = await import(DIST);
const { PALETTE, SEMANTIC, SPECIALTY, DRACULA, TYPOGRAPHY, LEGACY_ALIASES, ALL_TOKENS, TOKEN_NAMES } = brand;

describe("@zeroroot/brand token exports", () => {
  test("PALETTE has three ramps (base, primary, secondary)", () => {
    assert.ok(PALETTE.base, "PALETTE.base missing");
    assert.ok(PALETTE.primary, "PALETTE.primary missing");
    assert.ok(PALETTE.secondary, "PALETTE.secondary missing");
  });

  test("PALETTE ramps each have 12 steps", () => {
    for (const ramp of ["base", "primary", "secondary"]) {
      const steps = Object.keys(PALETTE[ramp]);
      assert.strictEqual(steps.length, 12, `PALETTE.${ramp} should have 12 steps, got ${steps.length}`);
    }
  });

  test("PALETTE base-1000 is the darkest value", () => {
    assert.strictEqual(PALETTE.base["1000"], "oklch(0.090 0.010 280)");
  });

  test("SEMANTIC has expected key tokens with correct values", () => {
    assert.strictEqual(SEMANTIC.background, "oklch(0.17 0.012 280)", "background");
    assert.strictEqual(SEMANTIC.foreground, "oklch(0.96 0.008 280)", "foreground");
    assert.strictEqual(SEMANTIC.primary, "oklch(0.58 0.225 295)", "primary (electric violet)");
    assert.strictEqual(SEMANTIC.border, "oklch(0.34 0.020 280)", "border");
    assert.ok(SEMANTIC.radius, "radius should be present");
  });

  test("SEMANTIC has all 34 expected keys", () => {
    const expectedKeys = [
      "background", "foreground", "card", "card-foreground",
      "popover", "popover-foreground", "primary", "primary-foreground",
      "secondary", "secondary-foreground", "muted", "muted-foreground",
      "accent", "accent-foreground", "destructive", "destructive-foreground",
      "error-text", "warning", "warning-foreground", "success-foreground",
      "overlay", "border", "input", "ring",
      "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
      "radius", "sidebar", "sidebar-foreground", "sidebar-primary",
      "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground",
      "sidebar-border", "sidebar-ring",
    ];
    for (const key of expectedKeys) {
      assert.ok(key in SEMANTIC, `SEMANTIC missing key: ${key}`);
    }
  });

  test("SPECIALTY has the 7 expected tokens", () => {
    const expectedKeys = ["highlight", "alt", "link", "glow-strength", "scanline-opacity", "scanline-color", "terminal-bg"];
    for (const key of expectedKeys) {
      assert.ok(key in SPECIALTY, `SPECIALTY missing key: ${key}`);
    }
    assert.strictEqual(SPECIALTY.highlight, "oklch(0.68 0.255 295)", "highlight (electric violet)");
    assert.strictEqual(SPECIALTY.link, "oklch(0.80 0.160 235)", "link (cyan-blue)");
    assert.strictEqual(SPECIALTY.alt, "oklch(0.76 0.170 162)", "alt (emerald)");
  });

  test("DRACULA has all 9 terminal palette entries", () => {
    const expectedKeys = [
      "dracula-fg", "dracula-comment", "dracula-cyan", "dracula-green",
      "dracula-orange", "dracula-pink", "dracula-purple", "dracula-red", "dracula-yellow",
    ];
    for (const key of expectedKeys) {
      assert.ok(key in DRACULA, `DRACULA missing key: ${key}`);
    }
    assert.strictEqual(DRACULA["dracula-purple"], "#bd93f9");
  });

  test("TYPOGRAPHY has display-family, display-weight, text-family", () => {
    assert.ok(TYPOGRAPHY["display-family"].includes("JetBrains Mono"), "display font stack");
    assert.strictEqual(TYPOGRAPHY["display-weight"], "800");
    assert.ok(TYPOGRAPHY["text-family"].includes("JetBrains Mono"), "text font stack");
  });

  test("LEGACY_ALIASES has all 9 --color-zd-* entries", () => {
    const expectedKeys = [
      "color-zd-bg", "color-zd-bg-deep", "color-zd-fg",
      "color-zd-highlight", "color-zd-alt", "color-zd-link",
      "color-zd-border", "color-zd-accent-purple", "color-zd-accent-orange",
    ];
    for (const key of expectedKeys) {
      assert.ok(key in LEGACY_ALIASES, `LEGACY_ALIASES missing key: ${key}`);
    }
  });

  test("LEGACY_ALIASES resolve to correct values", () => {
    assert.strictEqual(LEGACY_ALIASES["color-zd-bg"], "oklch(0.17 0.012 280)");
    assert.strictEqual(LEGACY_ALIASES["color-zd-accent-purple"], "oklch(0.58 0.225 295)");
  });

  test("ALL_TOKENS contains merged entries from all groups", () => {
    // Check a representative from each group
    assert.ok("base-50" in ALL_TOKENS, "palette token in ALL_TOKENS");
    assert.ok("background" in ALL_TOKENS, "semantic token in ALL_TOKENS");
    assert.ok("highlight" in ALL_TOKENS, "specialty token in ALL_TOKENS");
    assert.ok("dracula-fg" in ALL_TOKENS, "dracula token in ALL_TOKENS");
    assert.ok("display-family" in ALL_TOKENS, "typography token in ALL_TOKENS");
    assert.ok("color-zd-bg" in ALL_TOKENS, "legacy alias in ALL_TOKENS");
  });

  test("ALL_TOKENS has at least 80 entries", () => {
    const count = Object.keys(ALL_TOKENS).length;
    assert.ok(count >= 80, `ALL_TOKENS should have >=80 entries, got ${count}`);
  });

  test("TOKEN_NAMES is a non-empty array matching ALL_TOKENS keys", () => {
    assert.ok(Array.isArray(TOKEN_NAMES), "TOKEN_NAMES must be an array");
    assert.strictEqual(TOKEN_NAMES.length, Object.keys(ALL_TOKENS).length);
    assert.ok(TOKEN_NAMES.includes("background"), "TOKEN_NAMES includes 'background'");
    assert.ok(TOKEN_NAMES.includes("highlight"), "TOKEN_NAMES includes 'highlight'");
  });
});
