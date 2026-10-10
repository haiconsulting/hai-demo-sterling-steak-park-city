/**
 * Regression suite for "minimizing doesn't work on the live site". Runs against
 * the production static export with touch input on an iPhone-sized viewport:
 * Chromium with touch emulation, and WebKit with the iPhone 14 profile when
 * WebKit is installed (see playwright.config.ts).
 *
 * Root cause covered by "after client-side navigation": the old pill's toggle
 * was an inline <script>, which React never executes when it renders the pill
 * on the client (e.g. landing on /pitch/ and tapping through to the demo).
 */
import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const shownState = (page: Page) =>
  page.evaluate(() => {
    const shown = [...document.querySelectorAll<HTMLElement>("[data-demo-ribbon]")].filter((el) => getComputedStyle(el).display !== "none");
    return shown.length === 1 ? shown[0].dataset.fohPillState : `${shown.length} shown`;
  });

const minimize = (page: Page) => page.getByRole("button", { name: "Minimize demo banner" });
const expand = (page: Page) => page.getByRole("button", { name: /Expand demo banner/ });

async function tapCycle(page: Page) {
  expect(await shownState(page)).toBe("full");
  await minimize(page).tap();
  await expect.poll(() => shownState(page)).toBe("tab");
  await expect(page.getByRole("complementary", { name: /minimized/ })).toContainText("FOH Demo");
  await expect(expand(page)).toHaveAttribute("aria-expanded", "false");

  await expand(page).tap();
  await expect.poll(() => shownState(page)).toBe("full");
  await expect(minimize(page)).toHaveAttribute("aria-expanded", "true");

  await minimize(page).tap();
  await expect.poll(() => shownState(page)).toBe("tab");
  await page.reload();
  expect(await shownState(page)).toBe("tab");
  await expand(page).tap();
  await expect.poll(() => shownState(page)).toBe("full");
  await page.reload();
  expect(await shownState(page)).toBe("full");
}

test("tap minimize, tab shows, tap tab, it expands, state survives reloads", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("", { waitUntil: "networkidle" });
  await tapCycle(page);
  expect(errors).toEqual([]);
});

test("works after client-side navigation into the demo (the live-site bug)", async ({ page }) => {
  await page.goto("pitch/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /^View (the Sterling )?demo$/ }).tap();
  await page.waitForURL((u) => !u.pathname.includes("/pitch"));
  await page.waitForLoadState("networkidle");
  // Same document as /pitch/: the demo's pill was mounted by React on the client, not from server HTML.
  expect(await page.evaluate(() => (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).name)).toContain("/pitch/");
  await tapCycle(page);
});

test("a saved minimized state is applied when the pill mounts on the client", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await minimize(page).tap();
  await page.getByRole("complementary", { name: /minimized/ }).getByRole("link", { name: "See the pitch" }).tap();
  await page.waitForURL("**/pitch/");
  // Leave and come back client-side: the pill remounts and must still be a tab.
  await page.evaluate(() => document.documentElement.removeAttribute("data-foh-pill"));
  await page.getByRole("link", { name: /^View (the Sterling )?demo$/ }).tap();
  await page.waitForURL((u) => !u.pathname.includes("/pitch"));
  await expect.poll(() => shownState(page)).toBe("tab");
});

test("a minimized pill never flashes open on reload", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await minimize(page).tap();
  await expect.poll(() => shownState(page)).toBe("tab");
  // Block all JS: the server-inserted pre-paint script still picks the right state.
  await page.route(/\/_next\/static\/.*\.js$/, (r) => r.abort());
  await page.reload({ waitUntil: "domcontentloaded" });
  expect(await shownState(page)).toBe("tab");
});

test("taps that land before React hydrates still toggle", async ({ page }) => {
  await page.route(/\/_next\/static\/.*\.js$/, (r) => r.abort());
  await page.goto("", { waitUntil: "domcontentloaded" });
  await minimize(page).tap();
  expect(await shownState(page)).toBe("tab");
  await expand(page).tap();
  expect(await shownState(page)).toBe("full");
});

test("the controls are the tap target: nothing covers them, and they are at least 48px", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  for (const which of ["minimize", "expand"] as const) {
    const btn = which === "minimize" ? minimize(page) : expand(page);
    const hit = await btn.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const pts = [
        [r.left + r.width / 2, r.top + r.height / 2],
        [r.left + 6, r.top + r.height / 2],
        [r.right - 6, r.top + r.height / 2],
      ];
      return { w: r.width, h: r.height, ok: pts.every(([x, y]) => el.contains(document.elementFromPoint(x, y))) };
    });
    expect(hit.w).toBeGreaterThanOrEqual(48);
    expect(hit.h).toBeGreaterThanOrEqual(48);
    expect(hit.ok, `${which} is covered`).toBe(true);
    await btn.tap();
  }
});
