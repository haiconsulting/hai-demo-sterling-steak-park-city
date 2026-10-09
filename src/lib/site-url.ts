/**
 * Resolves the absolute site URL (origin + base path) used for canonical, OG,
 * JSON-LD, sitemap and llms.txt. Precedence:
 *   1. NEXT_PUBLIC_SITE_URL (full URL, including any sub-path)
 *   2. https://VERCEL_PROJECT_PRODUCTION_URL + base path (set by Vercel at build)
 *   3. NEXT_PUBLIC_SITE_ORIGIN + base path (GitHub Pages workflow, Docker)
 *   4. https://haiconsulting.github.io + base path
 * Local hosts are never used: a localhost value is skipped for the next option.
 */
export const DEFAULT_ORIGIN = "https://haiconsulting.github.io";

type Env = Record<string, string | undefined>;

const LOCAL = /^(https?:\/\/)?(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i;

function clean(v: string | undefined): string | null {
  const s = v?.trim().replace(/\/+$/, "");
  if (!s || LOCAL.test(s)) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export function normalizeBasePath(v: string | undefined): string {
  const s = (v ?? "").trim().replace(/\/+$/, "");
  return !s ? "" : s.startsWith("/") ? s : `/${s}`;
}

export function resolveSiteUrl(env: Env): string {
  const base = normalizeBasePath(env.NEXT_PUBLIC_BASE_PATH);
  const explicit = clean(env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;
  const vercel = clean(env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `${vercel}${base}`;
  const origin = clean(env.NEXT_PUBLIC_SITE_ORIGIN) ?? DEFAULT_ORIGIN;
  return `${origin}${base}`;
}
