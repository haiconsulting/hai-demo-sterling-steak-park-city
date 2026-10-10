import { Mail, MapPin, Phone } from "lucide-react";
import { Photo } from "@/components/photo";
import { ReserveButton, OrderButton } from "@/components/cta";
import { SectionHead, Accent } from "@/components/section";
import { HoursList } from "@/components/hours";
import { JsonLd } from "@/components/json-ld";
import { fullAddress, site } from "@/data/site";
import { faq } from "@/data/faq";
import { siteGraph } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  path: "/visit/",
  title: "Hours, location and FAQ",
  description: `Hours, address and answers for Sterling Steak & Lounge, ${fullAddress}. Reservations on OpenTable, pickup on SpotOn.`,
});

export default function VisitPage() {
  return (
    <>
      <JsonLd data={siteGraph({ faq: true })} />

      <section className="stage-glow grain">
        <div className="container-st grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead as="h1" kicker="Visit" title={<>Find the <Accent>sign.</Accent></>} lede={`${site.address.neighborhood}, Park City. ${site.patio}.`} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ReserveButton />
              <OrderButton />
            </div>
          </div>
          <div className="aspect-[16/10] overflow-hidden rounded-[2rem] border border-st-cream/10">
            <Photo name="hero" sizes="(min-width: 1024px) 540px, 92vw" alt="The Sterling Steak and Lounge sign on the building at Kimball Junction" className="block h-full" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-st grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-st-cream/10 bg-st-char p-6 sm:p-8">
            <h2 className="kicker-st">Hours</h2>
            <HoursList className="mt-5 text-base" />
          </div>
          <div className="rounded-2xl border border-st-cream/10 bg-st-char p-6 sm:p-8">
            <h2 className="kicker-st">Contact</h2>
            <ul className="mt-5 space-y-4 text-st-cream/90">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-st-gold" aria-hidden />
                <a href={site.mapsUrl} target="_blank" rel="noopener" className="hover:text-st-gold-light">{fullAddress}</a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-st-gold" aria-hidden />
                <a href={`tel:${site.phone.e164}`} className="hover:text-st-gold-light">{site.phone.display}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-st-gold" aria-hidden />
                <a href={`mailto:${site.email}`} className="break-all hover:text-st-gold-light">{site.email}</a>
              </li>
            </ul>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="mt-8 inline-flex h-11 items-center rounded-full border border-st-cream/30 px-6 font-display text-sm tracking-[0.18em] text-st-cream uppercase hover:border-st-gold hover:text-st-gold-light">
              Get directions
            </a>
          </div>
        </div>
      </section>

      <section className="grain bg-st-char py-16 md:py-24" aria-labelledby="faq-title">
        <div className="container-st max-w-3xl">
          <p className="kicker-st">Good to know</p>
          <h2 id="faq-title" className="h-display mt-4 text-4xl text-st-cream sm:text-5xl">Questions, <Accent>answered.</Accent></h2>
          <div className="mt-10 divide-y divide-st-cream/10 border-y border-st-cream/10">
            {faq.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-2 font-display text-lg tracking-wide text-st-cream uppercase [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-2xl text-st-gold transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-1 pb-3 leading-relaxed text-st-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
