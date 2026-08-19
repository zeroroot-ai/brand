/**
 * @zeroroot-ai/brand — token tests.
 *
 * These assert the RULES of the acid-concrete brand rather than echoing its
 * values back. A test that restates the hex it is testing catches nothing; a
 * test that says "acid must fail as text and highlight must pass" catches the
 * mistake that would actually ship.
 *
 * Runs against the built dist/. Build first: node scripts/build.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "../../dist");

if (!existsSync(join(DIST, "index.js"))) {
  console.log("SKIP: dist/index.js not found — run 'node scripts/build.mjs' first.");
  process.exit(0);
}

const brand = await import(join(DIST, "index.js"));
const { PALETTE, SEMANTIC, SPECIALTY, DRACULA, TYPOGRAPHY, LEGACY_ALIASES, ALL_TOKENS, TOKEN_NAMES } = brand;

// ---------------------------------------------------------------------------
// Colour maths — oklch() → relative luminance → WCAG contrast ratio.
// ---------------------------------------------------------------------------

function parseOklch(value) {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return null;
  return { L: Number(m[1]), C: Number(m[2]), h: Number(m[3]) };
}

/** oklch → linear-light sRGB, clamped. */
function toLinearRgb({ L, C, h }) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const clamp = (x) => Math.min(1, Math.max(0, x));
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function luminance(cssColor) {
  const oklch = parseOklch(cssColor);
  assert.ok(oklch, `not an oklch() colour: ${cssColor}`);
  const [r, g, b] = toLinearRgb(oklch);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------

describe("token exports", () => {
  test("PALETTE has three ramps of twelve steps", () => {
    for (const ramp of ["base", "primary", "secondary"]) {
      assert.ok(PALETTE[ramp], `PALETTE.${ramp} missing`);
      assert.strictEqual(Object.keys(PALETTE[ramp]).length, 12, `PALETTE.${ramp}`);
    }
  });

  test("every group is populated", () => {
    for (const [name, group] of Object.entries({ SEMANTIC, SPECIALTY, DRACULA, TYPOGRAPHY, LEGACY_ALIASES })) {
      assert.ok(Object.keys(group).length > 0, `${name} is empty`);
    }
  });

  test("TOKEN_NAMES covers ALL_TOKENS", () => {
    assert.deepStrictEqual(TOKEN_NAMES.sort(), Object.keys(ALL_TOKENS).sort());
  });
});

describe("one locked LIGHT brand", () => {
  test("the ground is light and the ink is dark", () => {
    assert.ok(luminance(SEMANTIC.background) > 0.55, "background should be a light ground");
    assert.ok(luminance(SEMANTIC.foreground) < 0.08, "foreground should be near-black ink");
  });

  test("body text clears AA against the ground", () => {
    assert.ok(
      contrast(SEMANTIC.foreground, SEMANTIC.background) >= 4.5,
      "foreground on background must clear 4.5:1",
    );
  });

  test("muted text still clears AA against the ground", () => {
    assert.ok(
      contrast(SEMANTIC["muted-foreground"], SEMANTIC.background) >= 4.5,
      "muted-foreground on background must clear 4.5:1",
    );
  });
});

describe("acid is a fill, never text", () => {
  // The whole accent discipline in two assertions. If someone "fixes" the first
  // failure by darkening --primary, the second one holds the line: acid has to
  // stay bright enough to read as a fill with dark type on it.
  test("--primary fails as text on the ground, which is why --highlight exists", () => {
    assert.ok(
      contrast(SEMANTIC.primary, SEMANTIC.background) < 3,
      "acid must NOT be legible as text on the ground — if this passes, the fill has been darkened into a text colour",
    );
  });

  test("--highlight is the green that carries text, and clears AA", () => {
    assert.ok(
      contrast(SPECIALTY.highlight, SEMANTIC.background) >= 4.5,
      "highlight on background must clear 4.5:1",
    );
  });

  test("type on an acid fill clears AA", () => {
    assert.ok(
      contrast(SEMANTIC["primary-foreground"], SEMANTIC.primary) >= 4.5,
      "primary-foreground on primary must clear 4.5:1",
    );
  });
});

describe("enforcement colours", () => {
  test("granted, pending and refused all clear AA on the ground", () => {
    for (const name of ["granted", "pending", "refused"]) {
      assert.ok(
        contrast(SPECIALTY[name], SEMANTIC.background) >= 4.5,
        `${name} on background must clear 4.5:1`,
      );
    }
  });

  test("granted and refused are distinguishable from each other", () => {
    const g = parseOklch(SPECIALTY.granted);
    const r = parseOklch(SPECIALTY.refused);
    const dh = Math.abs(g.h - r.h);
    assert.ok(Math.min(dh, 360 - dh) > 60, "granted and refused must be far apart in hue");
  });
});

describe("inverted bands", () => {
  test("ink is dark and its foreground clears AA on it", () => {
    assert.ok(luminance(SPECIALTY.ink) < 0.08, "ink should be near-black");
    assert.ok(
      contrast(SPECIALTY["ink-foreground"], SPECIALTY.ink) >= 4.5,
      "ink-foreground on ink must clear 4.5:1",
    );
  });

  test("acid works as an accent ON an inverted band", () => {
    assert.ok(
      contrast(SEMANTIC.primary, SPECIALTY.ink) >= 4.5,
      "primary on ink must clear 4.5:1 — the hero eyebrow depends on it",
    );
  });
});

describe("typography ships what it names", () => {
  test("the families are the ones the brand self-hosts", () => {
    assert.match(TYPOGRAPHY["display-family"], /Inter Tight/);
    assert.match(TYPOGRAPHY["text-family"], /Inter Tight/);
    assert.match(TYPOGRAPHY["mono-family"], /JetBrains Mono/);
  });

  test("every @font-face src resolves to a shipped file", () => {
    const fontsCss = readFileSync(join(DIST, "fonts.css"), "utf8");
    const shipped = new Set(readdirSync(join(DIST, "fonts")));
    const refs = [...fontsCss.matchAll(/url\("\.\/fonts\/([^"]+)"\)/g)].map((m) => m[1]);
    assert.ok(refs.length > 0, "fonts.css declares no @font-face src");
    for (const ref of refs) {
      assert.ok(shipped.has(ref), `fonts.css references ${ref}, which is not in dist/fonts`);
    }
  });

  test("both named families are actually declared", () => {
    const fontsCss = readFileSync(join(DIST, "fonts.css"), "utf8");
    assert.match(fontsCss, /font-family:\s*"Inter Tight"/);
    assert.match(fontsCss, /font-family:\s*"JetBrains Mono"/);
  });
});

describe("no second copy of a token value", () => {
  test("every exported token is declared in tokens.css with the same value", () => {
    const css = readFileSync(join(DIST, "tokens.css"), "utf8");
    const declared = new Map(
      [...css.matchAll(/^\s*--([a-z0-9-]+):\s*(.+?);\s*$/gim)].map((m) => [m[1], m[2].trim()]),
    );
    for (const [name, value] of Object.entries(ALL_TOKENS)) {
      assert.ok(declared.has(name), `--${name} is exported but not declared in tokens.css`);
      assert.strictEqual(declared.get(name), value, `--${name} disagrees between tokens.css and the JS export`);
    }
    assert.strictEqual(declared.size, Object.keys(ALL_TOKENS).length, "tokens.css declares a token the exports do not");
  });

  test("globals.css does not redeclare tokens", () => {
    const globals = readFileSync(join(DIST, "globals.css"), "utf8");
    assert.ok(globals.includes('@import "./tokens.css"'), "globals.css should import tokens.css");
    assert.ok(globals.includes('@import "./fonts.css"'), "globals.css should import fonts.css");
    assert.ok(
      !/^\s*--background:/m.test(globals),
      "globals.css declares --background itself; tokens.css is the single source",
    );
  });
});

describe("legacy aliases still resolve", () => {
  test("every --color-zd-* alias has a value", () => {
    for (const [name, value] of Object.entries(LEGACY_ALIASES)) {
      assert.match(name, /^color-zd-/);
      assert.ok(value.length > 0, `${name} is empty`);
    }
  });

  test("the dracula ramp is untouched — terminal panels stay dark", () => {
    assert.strictEqual(DRACULA["dracula-green"], "#50fa7b");
    assert.strictEqual(DRACULA["dracula-fg"], "#f8f8f2");
  });
});
