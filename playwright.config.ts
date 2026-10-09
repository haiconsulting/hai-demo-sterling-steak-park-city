import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

/** Runs against the static export in out/ (build first), served like GitHub Pages. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.env.E2E_PORT ?? 4320);

// Use an installed Chrome when there is one, so no browser download is needed.
const chrome = [process.env.CHROME_PATH, "/usr/local/bin/google-chrome", "/usr/bin/google-chrome", "/opt/google/chrome/chrome"].find(
  (p): p is string => Boolean(p && existsSync(p)),
);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}/`,
    launchOptions: { executablePath: chrome, args: ["--no-sandbox"] },
  },
  webServer: {
    command: `node scripts/serve-pages.mjs ${port}`,
    url: `http://127.0.0.1:${port}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
  },
});
