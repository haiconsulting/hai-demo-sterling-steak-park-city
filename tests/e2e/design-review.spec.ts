/** Design Critic fixes: pill on /pitch, hero imagery, preload warnings, no dark flash, intent prefetch, CTAs. */
import { expect, test, type Page } from "@playwright/test";

const shown = (page: Page) =>
  page.evaluate(() => {
    const el = [...document.querySelectorAll<HTMLElement>("[data-demo-ribbon]")].find((e) => getComputedStyle(e).display !== "none");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { state: el.dataset.fohPillState, top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, vw: innerWidth, vh: innerHeight };
  });

test.describe("demo pill on /pitch", () => {
  for (const [label, viewport, mobile] of [
    ["phone", { width: 390, height: 844 }, true],
    ["desktop", { width: 1440, height: 900 }, false],
  ] as const) {
    test.describe(label, () => {
      test.use({ viewport, isMobile: mobile, hasTouch: mobile });

      test("offers 'Back to demo' instead of the pitch CTA, in both states", async ({ page }) => {
        await page.goto("pitch/", { waitUntil: "networkidle" });
        await expect(page.locator("[data-pitch-cta]")).toHaveCount(0);
        await expect(page.locator(".foh-nudge")).toHaveCount(0);
        const back = page.locator("[data-back-cta]:visible");
        await expect(back).toHaveCount(1);
        await expect(back).toContainText("Back to demo");
        expect(await back.getAttribute("href")).toMatch(/\/$/);

        await page.getByRole("button", { name: "Minimize demo banner" }).click();
        await expect(page.locator("[data-back-cta]:visible")).toHaveAttribute("aria-label", "Back to demo");
        await page.getByRole("button", { name: /Expand demo banner/ }).click();

        await page.locator("[data-back-cta]:visible").click();
        await page.waitForURL((u) => !u.pathname.includes("/pitch"));
        await expect(page.locator("[data-pitch-cta]:visible")).toHaveCount(1);
      });
    });
  }

  test.describe("phone, no bottom bar", () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    test("strip sits at the very bottom, full width, and reserves its space", async ({ page }) => {
      await page.goto("pitch/", { waitUntil: "networkidle" });
      const s = (await shown(page))!;
      expect(s.state).toBe("full");
      expect(Math.round(s.bottom)).toBe(s.vh);
      expect(Math.round(s.left)).toBe(0);
      expect(Math.round(s.right)).toBe(s.vw);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(150);
      const pill = (await shown(page))!;
      const lastText = await page.locator("footer p").last().evaluate((el) => el.getBoundingClientRect().bottom);
      expect(lastText).toBeLessThanOrEqual(pill.top);
    });
  });
});

test.describe("Sterling hero image", () => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    test(`loads eagerly at high priority and is above the fold (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("", { waitUntil: "load" });
      const img = page.locator("[data-hero-photo] img");
      await expect(img).toHaveAttribute("loading", "eager");
      await expect(img).toHaveAttribute("fetchpriority", "high");
      const info = await img.evaluate((el: HTMLImageElement) => {
        const r = el.getBoundingClientRect();
        const h1 = document.querySelector("h1")!.getBoundingClientRect();
        return { complete: el.complete && el.naturalWidth > 0, top: r.top, bottom: r.bottom, h1Top: h1.top, h1Bottom: h1.bottom, src: el.currentSrc };
      });
      expect(info.complete).toBe(true);
      expect(info.src).toContain("ribeye");
      expect(info.top).toBeLessThan(viewport.height);
      // On phones the photo sits behind the headline.
      if (viewport.width < 1024) {
        expect(info.top).toBeLessThanOrEqual(info.h1Top);
        expect(info.bottom).toBeGreaterThanOrEqual(info.h1Bottom);
      }
    });
  }
});

test.describe("no 'preloaded but not used' warnings", () => {
  for (const route of ["", "music/", "menu/", "private-events/", "visit/", "pitch/"]) {
    test(`/${route}`, async ({ page }) => {
      const warnings: string[] = [];
      page.on("console", (m) => /preload/i.test(m.text()) && warnings.push(m.text()));
      await page.goto(route, { waitUntil: "load" });
      await page.waitForTimeout(4000);
      expect(warnings).toEqual([]);
    });
  }
});

test.describe("navigating to /pitch", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("prefetches /pitch on intent and keeps html/body light on the pitch page", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    const prefetched: string[] = [];
    page.on("request", (r) => r.url().includes("/pitch/") && prefetched.push(r.url()));
    await page.locator("[data-pitch-cta]:visible").hover();
    await expect.poll(() => prefetched.length).toBeGreaterThan(0);

    const bgs: string[] = [];
    await page.exposeFunction("recordBg", (c: string) => bgs.push(c));
    await page.evaluate(() => {
      const w = window as unknown as { recordBg: (c: string) => void };
      const tick = () => {
        w.recordBg(getComputedStyle(document.body).backgroundColor);
        if (!location.pathname.includes("/pitch/") || !document.querySelector("[data-foh-pitch]")) requestAnimationFrame(tick);
      };
      tick();
    });
    await page.locator("[data-pitch-cta]:visible").click();
    await page.waitForURL("**/pitch/");
    await page.waitForLoadState("networkidle");
    const light = "rgb(251, 247, 240)";
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(light);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)).toBe(light);
    // Every frame painted on /pitch had the light background (no dark band before the page fills in).
    const pitchFrames = bgs.slice(bgs.lastIndexOf("rgb(15, 12, 11)") + 1);
    expect(pitchFrames.every((c) => c === light)).toBe(true);
  });

  test("full load of /pitch paints light from the first frame", async ({ page }) => {
    await page.goto("pitch/", { waitUntil: "commit" });
    await page.waitForFunction(() => document.body !== null);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(251, 247, 240)");
  });
});

test.describe("/pitch hero", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows before/after captures of the current site and this demo, right under the headline", async ({ page }) => {
    await page.goto("pitch/", { waitUntil: "networkidle" });
    const ba = page.locator("[data-before-after]");
    await expect(ba.locator("[data-side=current]")).toContainText("Today");
    await expect(ba.locator("[data-side=demo]")).toContainText("This demo");
    const imgs = ba.locator("img:visible");
    expect(await imgs.count()).toBe(4);
    for (const img of await imgs.all()) expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const gap = await page.evaluate(() => document.querySelector("[data-before-after]")!.getBoundingClientRect().top - document.querySelector("h1")!.getBoundingClientRect().bottom);
    expect(gap).toBeLessThanOrEqual(48);
  });

  test("primary CTA is 'Book a 15-min walkthrough' (mailto)", async ({ page }) => {
    await page.goto("pitch/", { waitUntil: "networkidle" });
    const ctas = page.locator("[data-walkthrough-cta]");
    expect(await ctas.count()).toBe(2);
    for (const c of await ctas.all()) {
      await expect(c).toHaveText("Book a 15-min walkthrough");
      expect(await c.getAttribute("href")).toMatch(/^mailto:hello@fohrestaurants\.com\?subject=/);
    }
    await expect(page.getByText("Start the conversation")).toHaveCount(0);
  });
});
