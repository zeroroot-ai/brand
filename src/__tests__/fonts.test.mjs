// SPDX-License-Identifier: Elastic-2.0
// Copyright 2026 Zero Root AI

/**
 * @zeroroot-ai/brand — font redistribution tests.
 *
 * This package publishes third-party font binaries to the public npm
 * registry. Neither Inter Tight nor JetBrains Mono is ours. Both are under the
 * SIL Open Font License 1.1, and clause 2 of that licence is a condition on
 * redistribution, not a courtesy:
 *
 *     Original or Modified Versions of the Font Software may be bundled,
 *     redistributed and/or sold with any software, provided that each copy
 *     contains the above copyright notice and this license.
 *
 * The package shipped without either for four releases. These tests make that
 * state fail the build instead of shipping again: drop a .woff2 into
 * src/fonts/ with no licence beside it and `npm test` goes red.
 *
 * Runs against the built dist/. Build first: node scripts/build.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const FONTS = join(ROOT, "dist/fonts");

/**
 * A licence file covers a font file when the family part of its name is a
 * prefix of the font's name. `JetBrains-Mono-OFL.txt` -> `jetbrains-mono`,
 * which prefixes `jetbrains-mono-latin-ext.woff2`.
 *
 * Matching on the name rather than on a hand-written table is the point: a
 * table goes stale silently, a prefix rule cannot. A new family whose licence
 * nobody added has no file whose prefix matches it.
 */
function family(licenceFile) {
  return licenceFile.replace(/-OFL\.txt$/i, "").toLowerCase();
}

function coveringLicence(fontFile, licenceFiles) {
  return licenceFiles.find((l) => fontFile.toLowerCase().startsWith(family(l)));
}

function listFonts() {
  return readdirSync(FONTS).filter((f) => f.endsWith(".woff2"));
}

function listLicences() {
  return readdirSync(FONTS).filter((f) => /-OFL\.txt$/i.test(f));
}

describe("redistributed fonts", () => {
  test("the build emits the font files", () => {
    assert.ok(existsSync(FONTS), "dist/fonts is missing — did scripts/build.mjs run?");
    assert.ok(listFonts().length > 0, "dist/fonts contains no .woff2 files");
  });

  test("every published font file ships the licence it is under", () => {
    const licences = listLicences();
    for (const font of listFonts()) {
      const licence = coveringLicence(font, licences);
      assert.ok(
        licence,
        `${font} is published with no licence text beside it. SIL OFL 1.1 ` +
          `clause 2 requires the copyright notice and the licence in every ` +
          `copy. Add dist/fonts/<Family>-OFL.txt, from src/fonts/.`,
      );
    }
  });

  test("each licence text is the real OFL and names its copyright holder", () => {
    for (const licence of listLicences()) {
      const text = readFileSync(join(FONTS, licence), "utf8");
      assert.match(
        text,
        /^Copyright \d{4} .+\(https?:\/\/\S+\)/m,
        `${licence} has no upstream copyright line. Clause 2 requires "the ` +
          `above copyright notice", not the licence body alone.`,
      );
      assert.match(
        text,
        /SIL Open Font License, Version 1\.1/,
        `${licence} does not name SIL OFL 1.1`,
      );
      assert.match(
        text,
        /PERMISSION & CONDITIONS/,
        `${licence} is a stub, not the full licence text`,
      );
    }
  });

  test("NOTICE names every redistributed family and its copyright holder", () => {
    const notice = readFileSync(join(ROOT, "NOTICE"), "utf8");
    for (const licence of listLicences()) {
      const name = family(licence).replace(/-/g, " ");
      assert.match(
        notice,
        new RegExp(name, "i"),
        `NOTICE does not mention ${name}, which this package redistributes`,
      );
    }
    assert.match(notice, /SIL Open Font License, Version 1\.1/);
  });

  test("the package publishes NOTICE, not only dist", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    assert.ok(
      pkg.files.includes("NOTICE"),
      "NOTICE is not in package.json files, so npm would drop it and the " +
        "published tarball would carry the fonts without the attribution",
    );
    assert.ok(existsSync(join(ROOT, "dist/NOTICE")), "the build did not copy NOTICE into dist");
  });

  /**
   * The failing fixture. Without it the prefix rule above is a guard that
   * cannot fail: every font in the tree is covered today, so a broken matcher
   * would stay green until an uncovered family shipped.
   */
  test("the coverage check actually rejects an uncovered font", () => {
    const licences = ["Inter-Tight-OFL.txt", "JetBrains-Mono-OFL.txt"];
    assert.equal(
      coveringLicence("inter-tight-latin.woff2", licences),
      "Inter-Tight-OFL.txt",
      "the check failed to match a font to the licence that covers it",
    );
    assert.equal(
      coveringLicence("source-serif-latin.woff2", licences),
      undefined,
      "the check accepted a font family with no licence file",
    );
  });
});
