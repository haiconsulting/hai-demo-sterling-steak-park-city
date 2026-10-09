import { expect, test, type Page } from "@playwright/test";

const PAGES = ["", "music/", "menu/", "private-events/", "visit/", "pitch/"];
const WIDTHS = [320, 360, 375, 390, 414, 430];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.scrollingElement ?? document.documentElement;
    window.scrollTo(10_000, window.scrollY);
    const scrolledX = window.scrollX;
    window.scrollTo(0, window.scrollY);
    // Fixed bars (demo ribbon, action bar) never add page scroll, so check their contents directly.
    const clippedFixed = [...document.querySelectorAll("body *")]
      .filter((el) => getComputedStyle(el).position === "fixed")
      .flatMap((el) => [el, ...el.querySelectorAll("*")])
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && getComputedStyle(el).visibility !== "hidden" && (r.right > window.innerWidth + 0.5 || r.left < -0.5);
      })
      .map((el) => `${el.tagName.toLowerCase()} ${(el.textContent ?? "").trim().slice(0, 30)}`);
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, scrolledX, clippedFixed };
  });
}

for (const width of WIDTHS) {
  test.describe(`${width}px wide`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });

    for (const p of PAGES) {
      test(`/${p} has no horizontal scroll`, async ({ page }) => {
        await page.goto(p, { waitUntil: "networkidle" });
        const o = await horizontalOverflow(page);
        expect(o.scrollWidth, `scrollWidth ${o.scrollWidth} > ${o.clientWidth}`).toBeLessThanOrEqual(o.clientWidth);
        expect(o.scrolledX).toBe(0);
        expect(o.clippedFixed, "fixed elements clipped by the viewport").toEqual([]);
      });
    }

    test("/pitch comparison rows stack as full-width cards", async ({ page }) => {
      await page.goto("pitch/", { waitUntil: "networkidle" });
      const rows = page.getByTestId("compare-row");
      await expect(rows).toHaveCount(9);
      const boxes = await rows.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          const parts = [...el.children].map((c) => c.getBoundingClientRect());
          return { width: r.width, left: r.left, partWidths: parts.map((b) => b.width), partTops: parts.map((b) => b.top) };
        }),
      );
      for (const [i, b] of boxes.entries()) {
        expect(b.width, `row ${i} is ${Math.round(b.width)}px of ${width}px`).toBeGreaterThanOrEqual(width * 0.9);
        expect(b.left).toBeGreaterThanOrEqual(0);
        // Stacked: area, today and demo blocks sit one under another, each spanning the card.
        for (const w of b.partWidths) expect(w).toBeGreaterThanOrEqual(b.width * 0.8);
        expect(b.partTops).toEqual([...b.partTops].sort((x, y) => x - y));
      }
    });
  });
}

test.describe("768px and up", () => {
  test.use({ viewport: { width: 1024, height: 900 } });
  test("/pitch comparison renders as a three-column table", async ({ page }) => {
    await page.goto("pitch/", { waitUntil: "networkidle" });
    const tops = await page
      .getByTestId("compare-row")
      .first()
      .evaluate((el) => [...el.children].map((c) => Math.round(c.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
  });
});
