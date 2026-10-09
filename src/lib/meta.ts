import type { Metadata } from "next";
import { site } from "@/data/site";
import { absUrl } from "./paths";

/** The whole demo is noindex so it never competes with sterlingsteakandlounge.com. */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const OG_IMAGE = {
  url: absUrl("/img/og-sterling.jpg"),
  width: 1200,
  height: 630,
  alt: "Grilled ribeye on a white plate at Sterling Steak & Lounge",
};

export function pageMeta({ path, title, description }: { path: string; title?: string; description?: string }): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Steakhouse and live rock in Park City`;
  const desc = description ?? site.description;
  const url = absUrl(path);
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url,
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  };
}
