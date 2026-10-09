import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The pill's CSS lives in its self-contained component file (template literal `css`).
const source = readFileSync(path.resolve("src/components/foh/demo-pill.tsx"), "utf8");
const css = source.slice(source.indexOf("const css = `") + 13, source.indexOf("`;", source.indexOf("const css = `")));

function block(selectorOrAt: string, from = css): string {
  const start = from.indexOf(selectorOrAt);
  if (start < 0) return "";
  let depth = 0;
  for (let i = from.indexOf("{", start); i < from.length; i++) {
    if (from[i] === "{") depth++;
    if (from[i] === "}" && --depth === 0) return from.slice(start, i + 1);
  }
  return "";
}

describe("pitch button nudge animation", () => {
  it("defines the foh-nudge keyframes: scale to ~1.12 and wobble 3 to 4deg", () => {
    const kf = block("@keyframes foh-nudge");
    expect(kf).not.toBe("");
    expect(kf).toMatch(/scale\(1\.12\)/);
    const angles = [...kf.matchAll(/rotate\((-?[\d.]+)deg\)/g)].map((m) => Math.abs(Number(m[1])));
    expect(Math.max(...angles)).toBeGreaterThanOrEqual(3);
    expect(Math.max(...angles)).toBeLessThanOrEqual(4);
  });

  it("runs every 4s, forever, with the motion in the last ~600ms", () => {
    expect(css).toMatch(/\.foh-nudge\s*\{[^}]*animation:\s*foh-nudge\s+4s\b[^;}]*infinite/);
    const kf = block("@keyframes foh-nudge");
    expect(kf).toMatch(/0%,\s*85%,\s*100%\s*\{\s*transform:\s*scale\(1\)\s*rotate\(0deg\)/);
  });

  it("pauses on hover and focus", () => {
    const paused = css.slice(0, css.search(/animation-play-state:\s*paused/));
    const selectors = paused.slice(paused.lastIndexOf("}") + 1);
    expect(selectors).toContain(".foh-nudge:hover");
    expect(selectors).toContain(".foh-nudge:focus-visible");
    expect(selectors).toContain(".foh-pill:focus-within .foh-nudge");
  });

  it("is switched off under prefers-reduced-motion", () => {
    const rm = block("@media (prefers-reduced-motion:reduce)");
    expect(rm).toMatch(/\.foh-nudge\s*\{\s*animation:\s*none;?\s*\}/);
    expect(css.lastIndexOf("@media (prefers-reduced-motion:reduce)")).toBeGreaterThan(css.indexOf(".foh-nudge{"));
  });

  it("gives every pill state the nudge on its Pitch control", () => {
    expect(source.match(/data-pitch-cta[^>]*foh-nudge/g)).toHaveLength(2);
  });
});
