/**
 * @zeroroot-ai/brand — mark tests.
 *
 * The marks exist to be INLINED into a host document, where they take their
 * colour from whatever they sit inside. That property is what lets one file
 * serve light and dark, the nav and the footer, www and the dashboard.
 *
 * So these tests assert the rule that makes inlining work — paint only in
 * currentColor — rather than echoing the path data back. A hard-coded fill is
 * the mistake that would actually ship: it renders correctly in the theme the
 * author happened to be looking at, and wrong in the other one.
 *
 * Runs against the built dist/. Build first: node scripts/build.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MARKS = join(__dirname, "../../dist/marks");

/**
 * Any colour literal an SVG can carry: hex, rgb()/hsl()/oklch(), or one of the
 * CSS named colours we would plausibly reach for. `none` and `currentColor`
 * are the only two paint values a brand mark is allowed to name.
 */
const COLOUR_LITERAL =
  /(?:fill|stroke)\s*=\s*"(?!none"|currentColor")([^"]+)"/gi;

function markFiles() {
  return readdirSync(MARKS).filter((f) => f.endsWith(".svg"));
}

describe("brand marks", () => {
  test("the build emits at least one mark", () => {
    assert.ok(existsSync(MARKS), "dist/marks is missing — did scripts/build.mjs run?");
    assert.ok(markFiles().length > 0, "dist/marks contains no .svg files");
  });

  test("every mark paints only in currentColor or none", () => {
    for (const file of markFiles()) {
      const svg = readFileSync(join(MARKS, file), "utf8");
      const offenders = [...svg.matchAll(COLOUR_LITERAL)].map((m) => m[0]);
      assert.deepEqual(
        offenders,
        [],
        `${file} hard-codes a colour. A mark that names its own paint cannot ` +
          `serve both themes: ${offenders.join(", ")}`,
      );
      assert.match(
        svg,
        /currentColor/,
        `${file} never mentions currentColor, so it will not take the colour ` +
          `of the element it is inlined into`,
      );
    }
  });

  test("every mark carries a viewBox, so it scales to its container", () => {
    for (const file of markFiles()) {
      const svg = readFileSync(join(MARKS, file), "utf8");
      assert.match(svg, /viewBox="[^"]+"/, `${file} has no viewBox`);
    }
  });

  /**
   * The failing fixture. Without this, the currentColor test above is a guard
   * that cannot fail: if the regex were wrong, every real mark would pass and
   * nobody would learn until a hex shipped.
   */
  test("the currentColor check actually rejects a hard-coded colour", () => {
    const bad = '<svg viewBox="0 0 1 1"><rect fill="#ff0000" stroke="currentColor"/></svg>';
    const offenders = [...bad.matchAll(COLOUR_LITERAL)].map((m) => m[0]);
    assert.equal(offenders.length, 1, "the check missed a hex fill");
    assert.match(offenders[0], /#ff0000/);

    const good = '<svg viewBox="0 0 1 1"><rect fill="none" stroke="currentColor"/></svg>';
    assert.equal(
      [...good.matchAll(COLOUR_LITERAL)].length,
      0,
      "the check flagged a legitimate none/currentColor mark",
    );
  });
});
