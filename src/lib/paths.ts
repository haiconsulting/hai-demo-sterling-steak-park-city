import { normalizeBasePath, resolveSiteUrl } from "./site-url";

/**
 * Every URL in the app goes through these helpers so the site works both at a
 * domain root (Vercel, Docker) and under a sub-path such as GitHub Pages
 * (/hai-demo-sterling-steak-park-city). next/link applies basePath on its own;
 * plain <img>, <source>, CSS urls, JSON-LD and metadata do not.
 */
export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** Inlined by next.config `env`, so it is identical on server and client. */
export const SITE_URL = process.env.NEXT_PUBLIC_RESOLVED_SITE_URL || resolveSiteUrl(process.env);

/** Path for a file in /public, e.g. asset("/img/hero-640.webp"). */
export function asset(p: string): string {
  return `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;
}

/** Fully qualified URL for a route or public file, e.g. absUrl("/menu/"). */
export function absUrl(p = "/"): string {
  return `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;
}
