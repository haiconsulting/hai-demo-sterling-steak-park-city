// Full-page screenshots of the key pages, desktop and mobile.
// Usage: node scripts/screenshots.mjs <baseUrl> <outDir>
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = (process.argv[2] ?? "http://127.0.0.1:4318").replace(/\/$/, "");
const outDir = process.argv[3] ?? "screenshots";
const pages = [
  ["home", "/"],
  ["music", "/music/"],
  ["menu", "/menu/"],
  ["private-events", "/private-events/"],
  ["visit", "/visit/"],
  ["pitch", "/pitch/"],
];
const viewports = [
  ["desktop", { width: 1440, height: 900 }, 1],
  ["mobile", { width: 390, height: 844 }, 2],
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome",
  args: ["--no-sandbox"],
});
for (const [vpName, viewport, dpr] of viewports) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, timezoneId: "America/Denver" });
  const page = await ctx.newPage();
  for (const [name, p] of pages) {
    await page.goto(`${baseUrl}${p}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager")));
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 });
    await page.waitForTimeout(400);
    const file = `${outDir}/${name}-${vpName}.png`;
    await page.screenshot({ path: file, fullPage: process.env.FULL !== "0" });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();
