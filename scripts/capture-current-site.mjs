// Captures the restaurant's current site above the fold, desktop and mobile,
// for the before/after on /pitch. Usage: node scripts/capture-current-site.mjs [url]
import { chromium, devices } from "playwright-core";

const url = process.argv[2] ?? "https://sterlingsteakandlounge.com/";
const out = "assets-src/pitch";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
});
const shots = [
  ["current-desktop", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
  ["current-mobile", { ...devices["iPhone 14"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }],
];
for (const [name, opts] of shots) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(6000); // let the hero video poster, fonts and pop-ups settle as a visitor would see them
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(`${out}/${name}.png`);
  await ctx.close();
}
await browser.close();
