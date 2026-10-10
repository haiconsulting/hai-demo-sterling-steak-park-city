/** Tester QA fixes: less "to confirm" noise, real hours, 44px targets, axe clean, legible header logo. */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SITE_PAGES = ["", "music/", "menu/", "private-events/", "visit/"];
const ALL_PAGES = [...SITE_PAGES, "pitch/", "no-such-page/"];

test.describe("axe: no serious or critical issues (label-in-name enabled)", () => {
  for (const width of [375, 1440]) {
    for (const route of ALL_PAGES) {
      test(`/${route} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(route, { waitUntil: "networkidle" });
        const res = await new AxeBuilder({ page }).options({ rules: { "label-content-name-mismatch": { enabled: true } } }).analyze();
        const bad = res.violations
          .filter((v) => v.impact === "serious" || v.impact === "critical")
          .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
        expect(bad).toEqual([]);
      });
    }
  }
});

test.describe("restaurant pages read as finished", () => {
  for (const route of SITE_PAGES) {
    test(`/${route} has no 'to confirm' chips`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("body")).not.toContainText(/to confirm/i);
    });
  }

  test("hours are stated cleanly, with Sunday brunch", async ({ page }) => {
    await page.goto("visit/", { waitUntil: "networkidle" });
    const hours = page.locator("main dl").first();
    await expect(hours).toContainText("Daily");
    await expect(hours).toContainText("4 pm to 10 pm");
    await expect(hours).toContainText("Sunday brunch");
    await expect(hours).toContainText("10 am to 2 pm");
    await expect(page.locator("footer dl")).toContainText("10 am to 2 pm");
  });

  test("unpriced cuts show 'Market price'", async ({ page }) => {
    await page.goto("menu/", { waitUntil: "networkidle" });
    for (const item of ["Ribeye", "Tomahawk", "Surf & Turf"]) {
      await expect(page.locator("li", { hasText: item }).first()).toContainText("Market price");
    }
  });

  test("gift cards link to SpotOn", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    await expect(page.locator("footer").getByRole("link", { name: "Gift cards" })).toHaveAttribute("href", /^https:\/\/egiftcards\.spoton\.com\//);
  });

  test("'Sample lineup' badge is subtle (no border, small muted text)", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    const badge = page.getByText("Sample lineup").first();
    const s = await badge.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { border: cs.borderTopWidth, size: parseFloat(cs.fontSize), transform: cs.textTransform };
    });
    expect(s.border).toBe("0px");
    expect(s.size).toBeLessThanOrEqual(11);
    expect(s.transform).toBe("none");
  });

  test("/pitch keeps the sign-off footnote", async ({ page }) => {
    await page.goto("pitch/", { waitUntil: "networkidle" });
    await expect(page.locator("body")).toContainText("Sign off on hours");
    await expect(page.locator("body")).toContainText("current site and OpenTable");
  });
});

test.describe("mobile tap targets are at least 44px", () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

  const check = async (loc: import("@playwright/test").Locator, label: string) => {
    const n = await loc.count();
    expect(n, label).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const box = (await loc.nth(i).boundingBox())!;
      expect(box.height, `${label} #${i} height`).toBeGreaterThanOrEqual(44);
      expect(box.width, `${label} #${i} width`).toBeGreaterThanOrEqual(44);
    }
  };

  test("header, footer and home links", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    await check(page.locator("header").getByRole("link", { name: /^Reserve/ }), "header Reserve");
    await check(page.getByRole("button", { name: "Open menu" }), "hamburger");
    await check(page.locator("header a[href$='/']").first(), "logo link");
    await check(page.getByRole("navigation", { name: "Footer" }).getByRole("link"), "footer nav");
    await check(page.locator("footer address a"), "footer address, phone, email");
    await check(page.locator("footer ul a"), "footer social and gift cards");
    await check(page.getByRole("link", { name: /See who's playing this week/ }), "See who's playing");
    await check(page.getByRole("link", { name: /Full lineup/ }), "Full lineup");
  });

  test("FAQ rows", async ({ page }) => {
    await page.goto("visit/", { waitUntil: "networkidle" });
    await check(page.locator("details > summary"), "FAQ summary");
  });

  test("/pitch header links", async ({ page }) => {
    await page.goto("pitch/", { waitUntil: "networkidle" });
    await check(page.locator("header a"), "pitch header links");
  });
});

test.describe("header logo is legible on phones", () => {
  for (const width of [320, 375, 430]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("", { waitUntil: "networkidle" });
      const img = page.locator("header img").first();
      await expect(img).toHaveAttribute("src", /logo-shield/);
      const box = (await img.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      const link = page.locator("header a").first();
      await expect(link).toHaveAccessibleName("Sterling Steak & Lounge");
      if (width >= 360) await expect(link.getByText("Sterling", { exact: true })).toBeVisible();
    });
  }
});

test("FOH mark on /pitch has alt text", async ({ page }) => {
  await page.goto("pitch/", { waitUntil: "networkidle" });
  const mark = page.locator("header svg[role=img]").first();
  await expect(mark).toHaveAccessibleName("Front of House awning logo");
  await expect(mark.locator("title")).toHaveText("Front of House awning logo");
});
