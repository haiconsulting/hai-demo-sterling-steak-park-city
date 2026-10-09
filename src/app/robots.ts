import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/paths";

export const dynamic = "force-static";

/**
 * Crawling stays allowed even in demo mode: the demo is kept out of search
 * results by the noindex,nofollow meta on every page, and a Disallow here
 * would stop crawlers from ever seeing that tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absUrl("/sitemap.xml"),
  };
}
