import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { webkit } from "playwright-core";

/** Runs against the production static export in out/ (build first), served like GitHub Pages. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.env.E2E_PORT ?? 4320);

// Use an installed Chrome when there is one, so no browser download is needed.
const chrome = [process.env.CHROME_PATH, "/usr/local/bin/google-chrome", "/usr/bin/google-chrome", "/opt/google/chrome/chrome"].find(
  (p): p is string => Boolean(p && existsSync(p)),
);

// WebKit (Safari's engine) runs the iPhone touch suite when it is installed:
// `npx playwright install --with-deps webkit`. CI installs it; set E2E_WEBKIT=0 to skip.
const hasWebkit = process.env.E2E_WEBKIT !== "0" && (() => {
  try {
    return existsSync(webkit.executablePath());
  } catch {
    return false;
  }
})();

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://127.0.0.1:${port}${basePath}/` },
  projects: [
    { name: "chromium", use: { launchOptions: { executablePath: chrome, args: ["--no-sandbox"] } } },
    ...(hasWebkit
      ? [{ name: "webkit-iphone", testMatch: /pill-touch\.spec\.ts/, use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } } }]
      : []),
  ],
  webServer: {
    command: `node scripts/serve-pages.mjs ${port}`,
    url: `http://127.0.0.1:${port}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
  },
});
