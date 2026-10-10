/**
 * The site must stay fully static: plain files on a CDN, no server function on
 * any route, so a cold load is just a cached file (Vercel, Pages or Docker).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ROUTES } from "../src/lib/routes";

const read = (p: string) => readFileSync(path.resolve(p), "utf8");

function files(dir: string, ext: RegExp): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? files(p, ext) : ext.test(f) ? [p] : [];
  });
}

describe("fully static export", () => {
  it("builds with output: 'export'", () => {
    expect(read("next.config.ts")).toMatch(/output:\s*"export"/);
  });

  it("deploys to Vercel as static files only", () => {
    const v = JSON.parse(read("vercel.json"));
    expect(v.framework).toBeNull();
    expect(v.outputDirectory).toBe("out");
    expect(v.functions).toBeUndefined();
    expect(v.rewrites).toBeUndefined();
    expect(existsSync("api")).toBe(false);
  });

  it("has no server-only code in any route", () => {
    for (const f of files("src/app", /\.(ts|tsx)$/)) {
      const src = read(f);
      expect(src, f).not.toMatch(/["']use server["']/);
      expect(src, f).not.toMatch(/force-dynamic|export const revalidate|export const runtime/);
      expect(src, f).not.toMatch(/\b(cookies|headers|draftMode)\(\)/);
      if (/route\.ts$/.test(f)) expect(src, f).toMatch(/export const dynamic = "force-static"/);
    }
  });

  it.skipIf(!existsSync("out/index.html"))("exported every route as a file", () => {
    for (const r of ROUTES) expect(existsSync(path.join("out", r.path, "index.html")), r.path).toBe(true);
    for (const f of ["pitch/index.html", "404.html", "llms.txt", "robots.txt", "sitemap.xml"]) expect(existsSync(path.join("out", f)), f).toBe(true);
  });
});
