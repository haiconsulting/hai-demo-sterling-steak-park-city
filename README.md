# Sterling Steak & Lounge: demo site concept

A sales-pitch demo of a new website for **Sterling Steak & Lounge** (Kimball Junction, Park City, UT), built by **Front of House (FOH) by HAI Consulting**. It is a working static site: Sterling's own brand on the restaurant pages, and HAI's FOH brand only on the demo pill and `/pitch`.

Live (after the Pages workflow runs): https://haiconsulting.github.io/hai-demo-sterling-steak-park-city/

> The whole demo is `noindex, nofollow` so it never competes with the real site at sterlingsteakandlounge.com.

## What's in it

| Route | What it shows |
|---|---|
| `/` | Music-first hero with **Tonight on stage**, this week's lineup, the House of Blues story, menu highlights with prices, guest quotes, private events teaser, hours |
| `/music/` | Weekly lineup, tonight highlighted in Park City time, MusicEvent schema |
| `/menu/` | Full menu from the current site; unknown prices show **Price to confirm** |
| `/private-events/` | Private room, rehearsal dinners, corporate, buyouts, plus an inquiry form (demo mode: validates and confirms, sends nothing, offers a prefilled email) |
| `/visit/` | The one set of hours, address, contact, FAQ with FAQPage schema |
| `/pitch/` | HAI/FOH-branded summary: current site vs this demo, the offer (build from $2,000 + Care+ $900/yr), what we need from Sterling |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | Generated from the same data at build time |

Reserve buttons deep-link to Sterling's OpenTable page and Order buttons to their SpotOn ordering page.

## Facts, placeholders and where to edit

All facts come from the FOH prospect one-pager (public research, Oct 9 2026). Nothing is invented: no prices, reviews or quotes. Unverified facts render with a dashed **To confirm** marker.

| File | Holds |
|---|---|
| `src/data/site.ts` | Name, address, phone, links, story, **the one hours record** (`hours.confirmed: false` until the owners sign off), Sunday brunch slot, happy hour |
| `src/data/menu.ts` | Menu sections and prices. `price: null` renders "Price to confirm" and is left out of the Menu schema |
| `src/data/lineup.ts` | **Tonight on stage**. `weeklyLineup` has one entry per night; `specialDates` overrides a date. `LINEUP_IS_SAMPLE = true` shows the "Sample lineup" badges; set it to `false` once the acts are real |
| `src/data/faq.ts` | FAQ answers (built from `site.ts`) |
| `src/data/pitch-metrics.ts` | Measured Lighthouse scores shown on `/pitch` (only real runs) |

Every page, the JSON-LD, the footer and `llms.txt` read from these files, so a fact changes in one place.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS v4, shadcn/ui primitives (Input, Textarea, Label)
- `output: "export"`: plain static files in `out/`, no server needed
- Images are pre-optimized into responsive AVIF and WebP by `scripts/optimize-images.mjs` (sharp) and served through a small `<Photo>` component; `images.unoptimized: true`
- JSON-LD typed with `schema-dts`: WebSite, Restaurant (with ReserveAction and OrderAction), Menu, MusicEvent (next 7 nights), FAQPage
- Fonts via `next/font`: Oswald and Zilla Slab for Sterling (scoped to the restaurant pages); Cormorant and Inter for FOH (scoped to `/pitch`)

## Run it locally

```bash
npm install
npm run dev            # http://localhost:4317
```

Build and serve exactly like GitHub Pages (under the sub-path, gzipped):

```bash
npm run build:pages    # NEXT_PUBLIC_BASE_PATH=/hai-demo-sterling-steak-park-city next build
npm run serve:pages    # http://127.0.0.1:4318/hai-demo-sterling-steak-park-city/
```

Root-path build: `npm run build && npm run serve` (http://127.0.0.1:4318/).

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | `""` | Sub-path for `basePath`/`assetPrefix` and every image, JSON-LD and metadata URL |
| `NEXT_PUBLIC_SITE_URL` | unset | Full site URL (including any sub-path) for canonical, OG, JSON-LD, sitemap and llms.txt. Wins over everything below |
| `VERCEL_PROJECT_PRODUCTION_URL` | set by Vercel | Used (with `https://` and the base path) when `NEXT_PUBLIC_SITE_URL` is unset |
| `NEXT_PUBLIC_SITE_ORIGIN` | `https://haiconsulting.github.io` | Origin used when neither of the above is set (GitHub Pages, Docker) |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | `false` removes noindex and the demo pill (for a real launch, also delete `src/app/pitch/`) |

The absolute URL is resolved once in `src/lib/site-url.ts` (and inlined by `next.config.ts`). Localhost values are never used: they are skipped in favor of the next option. All URLs go through `src/lib/paths.ts` (`asset()` for files in `public/`, `absUrl()` for absolute URLs). `next/link` applies the base path on its own.

## Tests

```bash
npm test               # next build, then vitest
npm run test:unit      # JSON-LD unit tests only
npm run test:e2e       # Playwright mobile layout checks against out/ (build first)
npm run lint && npm run typecheck
```

- `tests/jsonld.test.ts`: the graph round-trips as JSON, has the fixed facts, valid `HH:MM` hours and schema.org day URLs, only real prices in Menu offers, 7 MusicEvents with ISO 8601 dates and a Park City offset, and every internal URL built from `SITE_URL`.
- `tests/build-output.test.ts`: parses the JSON-LD in every exported page, checks noindex plus OG and Twitter tags on every page, that every root-relative `href`/`src`/`srcSet` carries the base path, that `.nojekyll`, `robots.txt`, `sitemap.xml` and `llms.txt` exist, one restaurant name throughout, and no em dashes in the HAI copy.

- `tests/site-url.test.ts`: URL precedence (`NEXT_PUBLIC_SITE_URL`, then Vercel production URL, then Pages origin) and localhost rejection.
- `tests/e2e/mobile-layout.spec.ts` (Playwright): every page at 320, 360, 375, 390, 414 and 430px has no horizontal scroll and no clipped fixed bars; `/pitch` comparison rows render as stacked cards at least 90% of the viewport wide below 768px, and as a table from 768px up. It uses an installed Chrome (`CHROME_PATH`, or the usual install paths); otherwise run `npx playwright install chromium` once.

- `tests/e2e/demo-ribbon.spec.ts` (Playwright): the demo pill reads "Demo concept by Front of House" ("Demo concept / Front of House" on phones) at about 1.4x its original size (17.4px text, 16px at 320px); the Pitch and minimize controls are at least 48x48px; at 320 to 430px it fits, sits above the Reserve/Order/Call bar, never covers the hero Reserve and Order buttons at 667 to 932px tall, and never hides the footer's last row. It has no dismiss control: minimizing collapses it to a "FOH Demo" tab in the same corner (also 48px targets, above the bar), expanding restores it, focus moves to the opposite control, and the state persists across reloads and pages. The Pitch nudge runs every 4s in both states, pauses on hover and focus, and is off under `prefers-reduced-motion`.
- `tests/ribbon-css.test.ts`: the `foh-nudge` keyframes (scale 1.12, wobble 3 to 4deg, motion in the last 600ms of a 4s cycle), the pause selectors and the reduced-motion override exist in the pill's CSS, and both Pitch controls carry the nudge.

### The demo pill

`src/components/foh/demo-pill.tsx` is self-contained (markup, CSS, awning mark, icons and state handling), so it can be copied into another Next.js App Router demo and rendered once per layout:

```tsx
<DemoPill
  pitchHref="/pitch/"        // on this route the CTA becomes "Back to demo" (no nudge)
  demoHref="/"               // where "Back to demo" goes
  desktopPosition="right"    // "left" (default) or "right", 768px and up
  mobileBarHeight="62px"     // the host's fixed bottom bar on phones, if any
  spacerColor="#231F1C"      // color of the in-flow spacer (match the footer)
/>
```

- Phones: a slim full-width strip sitting directly on the host's bottom bar (or the viewport bottom), so there are never three stacked layers of fixed UI. An in-flow spacer at the end of the page reserves its height, so it never hides the last content. Minimized, it is a small "FOH Demo" chip in the same corner.
- Desktop: a compact pill (about 460 by 50px) in the chosen bottom corner, with its own spacer.
- Links to the other route (pitch to demo and back) prefetch on hover, focus or touch instead of on load. Viewport prefetch would preload the other route's fonts and CSS, which browsers flag as "preloaded but not used".
- Minimize and expand are React `onClick` handlers on real `<button>`s (48px, `touch-action: manipulation`), with state read through `useSyncExternalStore` from `<html data-foh-pill="min">` and saved in `localStorage["foh-demo-pill"]` (`"min"` or `"open"`).
- On a full page load, a tiny script written into the server HTML only (`useServerInsertedHTML`) applies the saved state before first paint and handles taps that land before hydration. When the pill mounts on the client (client-side navigation), a layout effect applies the saved state before paint.
- Do not move the toggle back into an inline `<script>` in the component: React never executes scripts it renders on the client, which is what broke minimizing on the live site after navigating from `/pitch/` to the demo.

`tests/e2e/pill-touch.spec.ts` covers this with touch taps on a 390x844 iPhone viewport, in Chromium and (when installed) WebKit with the iPhone 14 profile: tap minimize, the tab shows, tap the tab, it expands, reload; plus client-side navigation, pre-hydration taps, no flash on reload, and unobstructed 48px targets.

## Deploy

### GitHub Pages (primary)

`.github/workflows/pages.yml` runs on every push to `main`: `npm ci`, `npm test`, `npm run build` with `NEXT_PUBLIC_BASE_PATH=/hai-demo-sterling-steak-park-city`, then `upload-pages-artifact` (`out/`) and `deploy-pages`. In the repo settings, set **Pages > Source** to **GitHub Actions**. `public/.nojekyll` keeps Pages from dropping the `_next/` folder.

Note: crawlers only read `robots.txt` at a domain root, so on a project sub-path the per-page `noindex` meta is what keeps the demo out of search. `robots.txt` allows crawling on purpose so that tag can be seen.

### Docker / Coolify

```bash
docker build -t sterling-demo .
docker run -p 3000:3000 sterling-demo
# sub-path variant:
docker build --build-arg NEXT_PUBLIC_BASE_PATH=/hai-demo-sterling-steak-park-city -t sterling-demo .
```

The image builds the static export, then serves `out/` on port 3000 with `scripts/serve-pages.mjs` (Node built-ins only, gzip, long cache for hashed assets, `404.html` fallback).

### Vercel

`vercel.json` sets `framework: null`, `installCommand: npm ci`, `buildCommand: npm run build` and `outputDirectory: out`, so Vercel serves the static export at `/` (leave `NEXT_PUBLIC_BASE_PATH` empty). Canonical, OG and JSON-LD URLs use `VERCEL_PROJECT_PRODUCTION_URL` automatically; set `NEXT_PUBLIC_SITE_URL` to use a custom domain instead.

## Lighthouse

Measured Oct 9 2026 with Lighthouse 12 (default simulated mobile) against the Pages build served gzipped under the sub-path:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 96 | 100 | 100 | 66 (noindex) / 100 with demo mode off |
| `/menu/` | 97 | 100 | 100 | 66 (noindex) / 100 with demo mode off |
| `/music/` | 96 | 100 | 100 | 66 (noindex) |
| `/private-events/` | 97 | 100 | 100 | 66 (noindex) |
| `/visit/` | 97 | 100 | 100 | 66 (noindex) |
| `/pitch/` | 94 | 100 | 100 | 66 (noindex) |

The only SEO deduction is the intentional `noindex`. `/pitch/` dropped from 96 to 94 with the before/after captures and the demo pill; the rest of the cost is the FOH brand fonts (Cormorant and Inter).

### Before/after captures on /pitch

`node scripts/capture-current-site.mjs` captures sterlingsteakandlounge.com above the fold (1440x900 and an iPhone 390x844) into `assets-src/pitch/`; `node scripts/capture-demo-site.mjs <baseUrl>` does the same for this demo (serve `out/` first). Then run `npm run images`.

## Other scripts

- `npm run images`: regenerate `public/img/` and `src/data/images.generated.json` from `assets-src/`
- `npm run screenshots -- <baseUrl> <outDir>`: full-page desktop and mobile screenshots of the key pages (uses `playwright-core` with a local Chrome; set `CHROME_PATH` if it isn't at `/usr/local/bin/google-chrome`)

## Credits

Photos and logo belong to Sterling Steak & Lounge and are used for this pitch demo only.
