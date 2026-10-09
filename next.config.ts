import type { NextConfig } from "next";
import { normalizeBasePath, resolveSiteUrl } from "./src/lib/site-url";

// "" for a domain root (Vercel, Docker); "/hai-demo-sterling-steak-park-city" for GitHub Pages.
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_RESOLVED_SITE_URL: resolveSiteUrl(process.env) },
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
