// Captures this demo's homepage above the fold (desktop and mobile) for the /pitch before/after.
// Usage: node scripts/capture-demo-site.mjs <baseUrl>   (serve out/ first)
import { chromium, devices } from "playwright-core";

const base = (process.argv[2] ?? "http://127.0.0.1:4318").replace(/\/$/, "");
const out = "assets-src/pitch";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome", args: ["--no-sandbox"] });
const shots = [
  ["demo-desktop", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, timezoneId: "America/Denver" }],
  ["demo-mobile", { ...devices["iPhone 14"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: "America/Denver" }],
];
for (const [name, opts] of shots) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelectorAll("*").forEach((el) => el.getAnimations().forEach((a) => a.pause())));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(`${out}/${name}.png`);
  await ctx.close();
}
await browser.close();
