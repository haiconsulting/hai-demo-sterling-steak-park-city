import Link from "next/link";
import { asset } from "@/lib/paths";
import { site } from "@/data/site";
import { ReserveButton, OrderButton } from "./cta";
import { MobileNav } from "./mobile-nav";

export const NAV = [
  { href: "/music/", label: "On stage" },
  { href: "/menu/", label: "Menu" },
  { href: "/private-events/", label: "Private events" },
  { href: "/visit/", label: "Visit" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-st-cream/10">
      {/* Blur lives on its own layer: backdrop-filter on the header would trap the fixed mobile menu inside it. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-st-black/85 backdrop-blur-md supports-[backdrop-filter]:bg-st-black/70" />
      <div className="container-st flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${site.name}, home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logo-146.webp")} alt="" width={146} height={140} className="h-11 w-auto md:h-14" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-slab text-xl font-semibold tracking-wide text-st-cream">Sterling</span>
            <span className="mt-1 font-display text-[0.62rem] tracking-[0.34em] text-st-gold uppercase">Steak &amp; Lounge</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="font-display text-[0.8rem] tracking-[0.22em] text-st-cream/80 uppercase transition-colors hover:text-st-gold-light">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <OrderButton className="hidden h-10 px-4 text-xs md:inline-flex" label="Order" />
          <ReserveButton className="h-10 px-4 text-xs sm:px-5" label="Reserve" />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
