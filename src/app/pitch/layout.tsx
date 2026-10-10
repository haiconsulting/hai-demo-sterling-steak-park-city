import type { Viewport } from "next";
import { Cormorant, Inter } from "next/font/google";
import { FohMark } from "@/components/foh/foh-mark";
import { DemoPill } from "@/components/foh/demo-pill";
import { IntentLink } from "@/components/intent-link";
import { IS_DEMO } from "@/lib/meta";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-face",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#FBF7F0", colorScheme: "light" };

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-foh-pitch className={`${cormorant.variable} ${inter.variable} min-h-dvh font-sans bg-foh-paper text-foh-body [color-scheme:light]`}>
      <header className="border-b border-foh-line bg-foh-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between gap-4 px-[clamp(1.25rem,4vw,3rem)]">
          <a href="https://fohrestaurants.com" className="flex min-h-11 items-center gap-3">
            <FohMark className="h-7 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-cormorant text-2xl font-semibold text-foh-ink">FOH</span>{" "}
              <span className="mt-0.5 text-[0.58rem] font-semibold tracking-[0.3em] text-foh-body uppercase">Front of House</span>
              <span className="sr-only"> by HAI Consulting</span>
            </span>
          </a>
          <IntentLink href="/" className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-foh-line px-4 text-sm font-semibold text-foh-ink transition-colors hover:border-foh-ink">
            <span className="sm:hidden">View demo</span>
            <span className="hidden sm:inline">View the Sterling demo</span>
          </IntentLink>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="border-t border-[#3A322B] bg-foh-ink text-foh-muted-on-ink">
        <div className="mx-auto flex max-w-[1140px] flex-col gap-3 px-[clamp(1.25rem,4vw,3rem)] py-10 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-cormorant text-lg font-semibold text-foh-paper">Front of House</span> by HAI Consulting. Built only for restaurants.
          </p>
          <p>
            <a href="mailto:hello@fohrestaurants.com" className="text-foh-paper underline-offset-4 hover:underline">hello@fohrestaurants.com</a>
            {" · "}
            <a href="tel:+17703642664" className="text-foh-paper underline-offset-4 hover:underline">(770) 364-2664</a>
          </p>
        </div>
      </footer>
      {IS_DEMO && <DemoPill desktopPosition="right" spacerColor="#221C18" />}
    </div>
  );
}
