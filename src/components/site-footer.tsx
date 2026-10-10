import Link from "next/link";
import { fullAddress, site } from "@/data/site";
import { asset } from "@/lib/paths";
import { HoursList } from "./hours";
import { NAV } from "./site-header";
import { ReserveButton, OrderButton } from "./cta";

export function SiteFooter() {
  return (
    <footer className="grain border-t border-st-cream/10 bg-st-char pb-20 md:pb-0">
      <div className="container-st grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-20">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/img/logo-146.webp")} alt={site.name} width={146} height={140} loading="lazy" className="h-20 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-st-mute">{site.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ReserveButton label="Reserve" className="h-11 px-5 text-xs" />
            <OrderButton label="Order" className="h-11 px-5 text-xs" />
          </div>
        </div>

        <div>
          <h2 className="kicker-st">Find us</h2>
          <address className="mt-3 text-sm leading-relaxed text-st-cream/85 not-italic">
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex min-h-11 items-center hover:text-st-gold-light">
              {fullAddress}
            </a>
            <span className="block pb-1 text-st-mute">{site.address.neighborhood}</span>
            <a href={`tel:${site.phone.e164}`} className="flex min-h-11 items-center hover:text-st-gold-light">{site.phone.display}</a>
            <a href={`mailto:${site.email}`} className="flex min-h-11 items-center break-all hover:text-st-gold-light">{site.email}</a>
          </address>
          <ul className="mt-2 flex flex-wrap gap-x-5 text-sm">
            <li><a href={site.links.instagram} target="_blank" rel="noopener" className="flex min-h-11 min-w-11 items-center text-st-gold-light hover:text-st-cream">Instagram</a></li>
            <li><a href={site.links.facebook} target="_blank" rel="noopener" className="flex min-h-11 min-w-11 items-center text-st-gold-light hover:text-st-cream">Facebook</a></li>
            <li><a href={site.links.giftCards} target="_blank" rel="noopener" className="flex min-h-11 min-w-11 items-center text-st-gold-light hover:text-st-cream">Gift cards</a></li>
          </ul>
        </div>

        <div>
          <h2 className="kicker-st">Hours</h2>
          <HoursList className="mt-4" compact />
          <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-5 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex min-h-11 min-w-11 items-center text-st-cream/80 hover:text-st-gold-light">{n.label}</Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-st-cream/10">
        <div className="container-st flex flex-col gap-2 py-6 text-xs text-st-mute md:flex-row md:items-center md:justify-between">
          <p>&copy; {site.name}. {site.address.city}, Utah.</p>
          <p>
            Demo concept. Photos courtesy of {site.name}. Not affiliated with the live site at{" "}
            <a href={site.links.currentSite} className="underline underline-offset-2" rel="noopener">sterlingsteakandlounge.com</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
