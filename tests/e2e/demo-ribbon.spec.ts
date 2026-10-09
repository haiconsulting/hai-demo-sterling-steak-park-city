import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [320, 360, 375, 390, 414, 430];
const BASE_FONT_PX = 0.78 * 16; // the pill's original size, before the 1.4x bump

type Box = { top: number; bottom: number; left: number; right: number; width: number; height: number };

async function measure(page: Page) {
  return page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
    };
    const pill = document.querySelector("[data-demo-ribbon]")!;
    return {
      pill: box(pill)!,
      pitch: box(pill.querySelector("[data-pitch-cta]"))!,
      dismiss: box(pill.querySelector('button[aria-label="Dismiss demo notice"]'))!,
      bar: box(document.querySelector('nav[aria-label="Quick actions"]')),
      fontPx: parseFloat(getComputedStyle(pill).fontSize),
      vw: window.innerWidth,
    };
  });
}

const overlaps = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

for (const width of WIDTHS) {
  test.describe(`demo pill at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });

    test("is bigger, has 48px tap targets, fits, and clears the action bar", async ({ page }) => {
      await page.goto("", { waitUntil: "networkidle" });
      const m = await measure(page);
      expect(m.fontPx).toBeGreaterThanOrEqual(width < 360 ? 16 : BASE_FONT_PX * 1.35);
      for (const t of [m.pitch, m.dismiss]) {
        expect(t.width).toBeGreaterThanOrEqual(48);
        expect(t.height).toBeGreaterThanOrEqual(48);
      }
      expect(m.pill.left).toBeGreaterThanOrEqual(0);
      expect(m.pill.right).toBeLessThanOrEqual(m.vw);
      expect(m.pitch.right).toBeLessThanOrEqual(m.pill.right);
      expect(m.dismiss.right).toBeLessThanOrEqual(m.pill.right);
      expect(m.bar).not.toBeNull();
      expect(m.pill.bottom).toBeLessThanOrEqual(m.bar!.top - 4);
    });

    for (const height of [667, 740, 844, 932]) {
      test(`does not cover the hero Reserve and Order buttons on first load (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto("", { waitUntil: "networkidle" });
        const m = await measure(page);
        for (const btn of await page.locator("[data-hero-ctas] a").all()) {
          const r = await btn.evaluate((el) => {
            const b = el.getBoundingClientRect();
            return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
          });
          if (r.top >= height) continue; // below the fold: reached by scrolling, not hidden
          expect(overlaps(r, m.pill), `${await btn.innerText()} under the pill`).toBe(false);
        }
      });
    }

    test("never hides the last row of the page", async ({ page }) => {
      await page.goto("", { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(150);
      const m = await measure(page);
      const last = await page.locator("footer p").last().evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
      });
      expect(overlaps(last, m.pill)).toBe(false);
      expect(overlaps(last, m.bar!)).toBe(false);
    });
  });
}

test.describe("demo pill on desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("is ~1.4x the original size and leaves the footer readable", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    const m = await measure(page);
    expect(m.fontPx).toBeGreaterThanOrEqual(BASE_FONT_PX * 1.35);
    expect(m.pitch.height).toBeGreaterThanOrEqual(48);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(150);
    const after = await measure(page);
    for (const p of await page.locator("footer p").all()) {
      const r = await p.evaluate((el) => {
        const b = el.getBoundingClientRect();
        return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
      });
      expect(overlaps(r, after.pill)).toBe(false);
    }
  });
});

test.describe("pitch button nudge animation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("runs every 4s with a 1.12 scale, and pauses on hover and focus", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    const cta = page.locator("[data-pitch-cta]");
    const style = () =>
      cta.evaluate((el) => {
        const s = getComputedStyle(el);
        return { name: s.animationName, duration: s.animationDuration, count: s.animationIterationCount, state: s.animationPlayState };
      });
    expect(await style()).toEqual({ name: "foh-nudge", duration: "4s", count: "infinite", state: "running" });

    const frames = await cta.evaluate((el) =>
      el.getAnimations().flatMap((a) => ((a.effect as KeyframeEffect).getKeyframes() as { transform?: string }[]).map((k) => k.transform ?? "")),
    );
    expect(frames.join(" ")).toContain("scale(1.12)");

    await cta.hover();
    expect((await style()).state).toBe("paused");
    await page.mouse.move(700, 100);
    expect((await style()).state).toBe("running");

    await cta.focus();
    expect((await style()).state).toBe("paused");
  });

  test("is off under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("", { waitUntil: "networkidle" });
    const cta = page.locator("[data-pitch-cta]");
    expect(await cta.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    expect(await cta.evaluate((el) => el.getAnimations().length)).toBe(0);
  });
});
