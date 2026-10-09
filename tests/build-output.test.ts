/**
 * Checks the static export in out/. `npm test` runs `next build` first, with
 * whatever NEXT_PUBLIC_BASE_PATH is set (CI uses the GitHub Pages sub-path).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "../src/lib/site-url";

const OUT = path.resolve("out");
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const hasBuild = existsSync(path.join(OUT, "index.html"));
const SITE_URL = resolveSiteUrl(process.env);

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) return f === "_next" ? [] : htmlFiles(p);
    return f.endsWith(".html") ? [p] : [];
  });
}

const PAGES = ["index.html", "menu/index.html", "music/index.html", "private-events/index.html", "visit/index.html", "pitch/index.html"];

describe.skipIf(!hasBuild)("static export", () => {
  const files = hasBuild ? htmlFiles(OUT) : [];

  it("exports every page with trailing-slash directories", () => {
    for (const p of PAGES) expect(existsSync(path.join(OUT, p)), p).toBe(true);
    expect(existsSync(path.join(OUT, "404.html"))).toBe(true);
  });

  it("ships .nojekyll, robots.txt, sitemap.xml and llms.txt", () => {
    expect(existsSync(path.join(OUT, ".nojekyll"))).toBe(true);
    const robots = readFileSync(path.join(OUT, "robots.txt"), "utf8");
    expect(robots).toMatch(/User-Agent: \*/i);
    expect(robots).toContain(`${BASE}/sitemap.xml`);
    const sitemap = readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
    expect(sitemap).toContain(`${BASE}/menu/</loc>`);
    expect(sitemap).not.toContain("/pitch/");
    const llms = readFileSync(path.join(OUT, "llms.txt"), "utf8");
    expect(llms).toMatch(/^# Sterling Steak & Lounge/);
    expect(llms).toContain("(435) 800-2884");
  });

  it("has valid JSON-LD on every page", () => {
    let blocks = 0;
    for (const f of files) {
      const html = readFileSync(f, "utf8");
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        blocks++;
        const data = JSON.parse(m[1]);
        expect(data["@context"]).toBe("https://schema.org");
        expect(Array.isArray(data["@graph"])).toBe(true);
        const types = data["@graph"].map((n: { "@type": string }) => n["@type"]);
        expect(types).toContain("Restaurant");
        for (const n of data["@graph"]) if (n["@id"]) expect(n["@id"]).toContain(`${BASE}/`);
      }
    }
    expect(blocks).toBeGreaterThanOrEqual(5);
  });

  it("puts Event and Menu schema where they belong", () => {
    const home = readFileSync(path.join(OUT, "index.html"), "utf8");
    expect(home).toContain('"@type":"MusicEvent"');
    expect(home).toContain('"@type":"Menu"');
    expect(readFileSync(path.join(OUT, "visit/index.html"), "utf8")).toContain('"@type":"FAQPage"');
  });

  it("is noindex on every page, with OG and Twitter cards", () => {
    for (const p of PAGES) {
      const html = readFileSync(path.join(OUT, p), "utf8");
      expect(html, p).toMatch(/<meta name="robots" content="noindex, nofollow/);
      expect(html, p).toMatch(/<meta property="og:title" content="[^"]+"/);
      expect(html, p).toMatch(/<meta property="og:image" content="https:\/\/[^"]+og-sterling\.jpg"/);
      expect(html, p).toMatch(/<meta name="twitter:card" content="summary_large_image"/);
      expect(html, p).not.toMatch(/og:site_name" content="null"/);
    }
  });

  it("prefixes every root-relative URL with the base path", () => {
    for (const f of files) {
      const html = readFileSync(f, "utf8");
      for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
        expect(m[1].startsWith(`${BASE}/`), `${path.relative(OUT, f)}: ${m[1]}`).toBe(true);
      }
      for (const m of html.matchAll(/\ssrcSet="([^"]*)"/g)) {
        for (const part of m[1].split(",")) expect(part.trim().startsWith(`${BASE}/img/`), part).toBe(true);
      }
    }
  });

  it("points canonical, OG and JSON-LD at the resolved site URL, never localhost", () => {
    for (const p of PAGES) {
      const html = readFileSync(path.join(OUT, p), "utf8");
      const route = p === "index.html" ? "/" : `/${p.replace(/index\.html$/, "")}`;
      expect(html, p).toContain(`<link rel="canonical" href="${SITE_URL}${route}"/>`);
      expect(html, p).toContain(`<meta property="og:url" content="${SITE_URL}${route}"/>`);
      if (p !== "pitch/index.html") expect(html, p).toContain(`"url":"${SITE_URL}/"`);
    }
    for (const f of [...files, path.join(OUT, "sitemap.xml"), path.join(OUT, "robots.txt"), path.join(OUT, "llms.txt")]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/);
    }
  });

  it("uses one restaurant name, and no em dashes in HAI copy", () => {
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/Sterling Steaks &amp; Lounge|Sterling Steaks & Lounge/);
    const pitch = readFileSync(path.join(OUT, "pitch/index.html"), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
    expect(pitch).not.toMatch(/\u2014|&mdash;/);
  });
});
