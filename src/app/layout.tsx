import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import { absUrl } from "@/lib/paths";
import { IS_DEMO, pageMeta } from "@/lib/meta";
import { ribbonInitScript } from "@/components/foh/demo-ribbon";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absUrl("/")),
  ...pageMeta({ path: "/" }),
  applicationName: site.name,
  authors: [{ name: site.name }],
  robots: IS_DEMO
    ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } }
    : { index: true, follow: true },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#0f0c0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <script dangerouslySetInnerHTML={{ __html: ribbonInitScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded focus:bg-st-gold focus:px-4 focus:py-2 focus:text-st-black">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
