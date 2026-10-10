import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [320, 360, 375, 390, 414, 430];

type Box = { top: number; bottom: number; left: number; right: number; width: number; height: number };

/** Measures whichever pill state (full or minimized tab) is currently shown. */
async function measure(page: Page) {
  return page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
    };
    const shown = [...document.querySelectorAll("[data-demo-ribbon]")].filter((el) => getComputedStyle(el).display !== "none");
    const pill = shown[0];
    return {
      shownCount: shown.length,
      state: (pill as HTMLElement | undefined)?.dataset.fohPillState ?? null,
      pill: box(pill)!,
      pitch: box(pill?.querySelector("[data-pitch-cta]") ?? null)!,
      toggle: box(pill?.querySelector("[data-foh-pill-minimize],[data-foh-pill-expand]") ?? null)!,
      bar: box(document.querySelector('nav[aria-label="Quick actions"]')),
      fontPx: pill ? parseFloat(getComputedStyle(pill).fontSize) : 0,
      vw: window.innerWidth,
    };
  });
}

const overlaps = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const rect = (el: Element) => {
  const b = el.getBoundingClientRect();
  return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
};
const visiblePitch = (page: Page) => page.locator("[data-pitch-cta]:visible");

for (const width of WIDTHS) {
  test.describe(`demo pill at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });

    test("is a slim full-width strip sitting directly on the Reserve/Order/Call bar, with 48px targets", async ({ page }) => {
      await page.goto("", { waitUntil: "networkidle" });
      const pill = page.getByRole("complementary", { name: "Demo concept by Front of House", exact: true });
      await expect(pill).toBeVisible();
      await expect(pill).toContainText("Demo concept");
      await expect(pill).toContainText("Front of House");
      await expect(pill).not.toContainText("HAI");
      const m = await measure(page);
      expect(m.state).toBe("full");
      expect(m.fontPx).toBeGreaterThanOrEqual(15);
      // One slim row, edge to edge, stacked on the bar with no gap: two fixed layers, not three.
      expect(m.pill.height).toBeLessThanOrEqual(58);
      expect(Math.round(m.pill.left)).toBe(0);
      expect(Math.round(m.pill.right)).toBe(m.vw);
      expect(m.bar).not.toBeNull();
      expect(Math.abs(m.pill.bottom - m.bar!.top)).toBeLessThanOrEqual(1);
      for (const t of [m.pitch, m.toggle]) {
        expect(t.width).toBeGreaterThanOrEqual(48);
        expect(t.height).toBeGreaterThanOrEqual(48);
        expect(t.right).toBeLessThanOrEqual(m.vw);
      }
    });

    test("minimized tab shows the mark, 'FOH Demo' and the Pitch arrow, with 48px targets above the action bar", async ({ page }) => {
      await page.goto("", { waitUntil: "networkidle" });
      const before = await measure(page);
      await page.getByRole("button", { name: "Minimize demo banner" }).click();
      const tab = page.getByRole("complementary", { name: "Demo concept by Front of House, minimized" });
      await expect(tab).toBeVisible();
      await expect(tab).toContainText("FOH Demo");
      await expect(tab.locator("svg.foh-pill__mark")).toBeVisible();
      await expect(tab.getByRole("link", { name: "See the pitch" })).toBeVisible();
      const m = await measure(page);
      expect(m.state).toBe("tab");
      expect(m.pill.width).toBeLessThan(before.pill.width * 0.75);
      expect(m.pill.left).toBeGreaterThanOrEqual(0);
      expect(m.pill.left).toBeLessThanOrEqual(16);
      for (const t of [m.pitch, m.toggle]) {
        expect(t.width).toBeGreaterThanOrEqual(48);
        expect(t.height).toBeGreaterThanOrEqual(48);
      }
      expect(m.pill.right).toBeLessThanOrEqual(m.vw);
      expect(m.pill.bottom).toBeLessThanOrEqual(m.bar!.top - 4);
    });

    for (const height of [667, 740, 844, 932]) {
      test(`does not cover the hero Reserve and Order buttons on first load (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto("", { waitUntil: "networkidle" });
        const m = await measure(page);
        for (const btn of await page.locator("[data-hero-ctas] a").all()) {
          const r = await btn.evaluate(rect);
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
      const last = await page.locator("footer p").last().evaluate(rect);
      expect(overlaps(last, m.pill)).toBe(false);
      expect(overlaps(last, m.bar!)).toBe(false);
    });
  });
}

test.describe("demo pill on desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("is compact, sits bottom-right, and leaves the footer readable", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    await expect(page.getByRole("complementary", { name: "Demo concept by Front of House", exact: true })).toContainText(
      "Demo concept by Front of House",
    );
    const m = await measure(page);
    expect(m.pill.width).toBeLessThanOrEqual(520);
    expect(m.pill.height).toBeLessThanOrEqual(52);
    expect(m.vw - m.pill.right).toBeGreaterThanOrEqual(16);
    expect(m.vw - m.pill.right).toBeLessThanOrEqual(24);
    expect(m.pill.left).toBeGreaterThan(m.vw / 2);
    expect(m.pitch.height).toBeGreaterThanOrEqual(40);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(150);
    const after = await measure(page);
    for (const p of await page.locator("footer p").all()) expect(overlaps(await p.evaluate(rect), after.pill)).toBe(false);
  });

  test("minimized tab stays in the same bottom-right corner", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    const before = await measure(page);
    await page.getByRole("button", { name: "Minimize demo banner" }).click();
    const m = await measure(page);
    expect(m.state).toBe("tab");
    expect(Math.round(m.pill.right)).toBe(Math.round(before.pill.right));
    expect(Math.round(m.pill.bottom)).toBe(Math.round(before.pill.bottom));
  });
});

test.describe("demo pill can be minimized but never removed", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("has no dismiss or close control", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    const pills = page.locator("[data-demo-ribbon]");
    await expect(pills.getByRole("button", { name: /dismiss|close|remove|hide/i })).toHaveCount(0);
    await expect(pills.getByRole("button", { name: "Minimize demo banner" })).toHaveCount(1);
  });

  test("every control in either state leaves a pill on screen", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    for (let round = 0; round < 3; round++) {
      const buttons = page.locator("[data-demo-ribbon]:visible button");
      const n = await buttons.count();
      expect(n).toBeGreaterThan(0);
      await buttons.first().click();
      expect((await measure(page)).shownCount).toBe(1);
    }
  });

  test("minimize and expand toggle the state and move focus", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Minimize demo banner" }).click();
    expect((await measure(page)).state).toBe("tab");
    await expect(page.getByRole("button", { name: /Expand demo banner/ })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.dataset.fohPill)).toBe("min");

    await page.getByRole("button", { name: /Expand demo banner/ }).click();
    expect((await measure(page)).state).toBe("full");
    await expect(page.getByRole("button", { name: "Minimize demo banner" })).toBeFocused();

    await page.getByRole("button", { name: "Minimize demo banner" }).press("Enter");
    expect((await measure(page)).state).toBe("tab");
  });

  test("state persists across reloads and pages, with no flash of the other state", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Minimize demo banner" }).click();
    expect(await page.evaluate(() => localStorage.getItem("foh-demo-pill"))).toBe("min");

    await page.reload({ waitUntil: "domcontentloaded" });
    expect((await measure(page)).state).toBe("tab");
    await page.goto("menu/", { waitUntil: "domcontentloaded" });
    expect((await measure(page)).state).toBe("tab");

    await page.getByRole("button", { name: /Expand demo banner/ }).click();
    expect(await page.evaluate(() => localStorage.getItem("foh-demo-pill"))).toBe("open");
    await page.reload({ waitUntil: "domcontentloaded" });
    expect((await measure(page)).state).toBe("full");
  });

  test("a pill dismissed under the old banner comes back minimized, not gone", async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("foh-demo-ribbon", "off");
        sessionStorage.setItem("seeded", "1");
      }
    });
    await page.goto("", { waitUntil: "networkidle" });
    const m = await measure(page);
    expect(m.shownCount).toBe(1);
    expect(m.state).toBe("tab");
  });

  test("Pitch arrow in the tab goes to /pitch", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Minimize demo banner" }).click();
    await page.getByRole("complementary", { name: /minimized/ }).getByRole("link", { name: "See the pitch" }).click();
    await page.waitForURL("**/pitch/");
  });
});

test.describe("pitch button nudge animation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const style = (page: Page) =>
    visiblePitch(page).evaluate((el) => {
      const s = getComputedStyle(el);
      return { name: s.animationName, duration: s.animationDuration, count: s.animationIterationCount, state: s.animationPlayState };
    });

  test("runs every 4s with a 1.12 scale in both states, and pauses on hover and focus", async ({ page }) => {
    await page.goto("", { waitUntil: "networkidle" });
    for (const state of ["full", "tab"]) {
      if (state === "tab") {
        await page.getByRole("button", { name: "Minimize demo banner" }).click();
        await page.mouse.move(700, 100);
        await page.locator("body").evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      }
      expect((await measure(page)).state).toBe(state);
      expect(await style(page), state).toEqual({ name: "foh-nudge", duration: "4s", count: "infinite", state: "running" });

      const frames = await visiblePitch(page).evaluate((el) =>
        el.getAnimations().flatMap((a) => ((a.effect as KeyframeEffect).getKeyframes() as { transform?: string }[]).map((k) => k.transform ?? "")),
      );
      expect(frames.join(" ")).toContain("scale(1.12)");

      await visiblePitch(page).hover();
      expect((await style(page)).state).toBe("paused");
      await page.mouse.move(700, 100);
      expect((await style(page)).state).toBe("running");

      await visiblePitch(page).focus();
      expect((await style(page)).state).toBe("paused");
      await visiblePitch(page).blur();
    }
  });

  test("is off under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("", { waitUntil: "networkidle" });
    for (const el of await page.locator("[data-pitch-cta]").all()) {
      expect(await el.evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
      expect(await el.evaluate((e) => e.getAnimations().length)).toBe(0);
    }
  });
});
