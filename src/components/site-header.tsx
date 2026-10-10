import Link from "next/link";
import { asset } from "@/lib/paths";
import { ReserveButton, OrderButton } from "./cta";
import { MobileNav } from "./mobile-nav";

export const NAV = [
  { href: "/music/", label: "On stage" },
  { href: "/menu/", label: "Menu" },
  { href: "/private-events/", label: "Private events" },
  { href: "/visit/", label: "Visit" },
];

/** `lazyLogo` for the root 404, whose tree ships with every route: an eager logo there becomes a preload on /pitch too. */
export function SiteHeader({ lazyLogo = false }: { lazyLogo?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-st-cream/10">
      {/* Blur lives on its own layer: backdrop-filter on the header would trap the fixed mobile menu inside it. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-st-black/85 backdrop-blur-md supports-[backdrop-filter]:bg-st-black/70" />
      <div className="container-st flex h-16 items-center justify-between gap-4 md:h-20">
        {/* The full logo's wordmark is unreadable at header size, so the header pairs the shield with live text. */}
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/img/logo-shield-112.webp")}
            srcSet={`${asset("/img/logo-shield-56.webp")} 56w, ${asset("/img/logo-shield-112.webp")} 112w, ${asset("/img/logo-shield-168.webp")} 168w`}
            sizes="(min-width: 768px) 52px, 42px"
            alt=""
            width={188}
            height={195}
            loading={lazyLogo ? "lazy" : undefined}
            className="h-11 w-auto md:h-[3.25rem]"
          />
          <span className="flex flex-col leading-none">
            <span className="font-slab text-xl font-semibold tracking-wide text-st-cream max-[359px]:sr-only md:text-2xl">Sterling</span>{" "}
            <span className="mt-1 font-display text-[0.62rem] tracking-[0.3em] text-st-gold uppercase max-[419px]:sr-only">Steak &amp; Lounge</span>
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
          <OrderButton className="hidden h-11 px-4 text-xs md:inline-flex" label="Order" />
          <ReserveButton className="h-11 px-4 text-xs sm:px-5" label="Reserve" />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
