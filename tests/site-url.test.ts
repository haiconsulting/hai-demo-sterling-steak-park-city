import { describe, expect, it } from "vitest";
import { DEFAULT_ORIGIN, resolveSiteUrl } from "@/lib/site-url";

describe("resolveSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL as the full URL", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://demo.example.com/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app", NEXT_PUBLIC_BASE_PATH: "/sub" }),
    ).toBe("https://demo.example.com");
  });

  it("falls back to the Vercel production URL at the root", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "sterling-demo.vercel.app", NEXT_PUBLIC_BASE_PATH: "" })).toBe(
      "https://sterling-demo.vercel.app",
    );
  });

  it("uses the GitHub Pages origin plus base path otherwise", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_BASE_PATH: "/hai-demo-sterling-steak-park-city" })).toBe(
      `${DEFAULT_ORIGIN}/hai-demo-sterling-steak-park-city`,
    );
    expect(resolveSiteUrl({})).toBe(DEFAULT_ORIGIN);
  });

  it("never resolves to a local host", () => {
    for (const local of ["http://localhost:3000", "localhost", "127.0.0.1:4318", "http://0.0.0.0", "[::1]:3000"]) {
      const url = resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: local, VERCEL_PROJECT_PRODUCTION_URL: local, NEXT_PUBLIC_SITE_ORIGIN: local });
      expect(url, local).toBe(DEFAULT_ORIGIN);
    }
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000", VERCEL_PROJECT_PRODUCTION_URL: "sterling.vercel.app" })).toBe(
      "https://sterling.vercel.app",
    );
  });
});
