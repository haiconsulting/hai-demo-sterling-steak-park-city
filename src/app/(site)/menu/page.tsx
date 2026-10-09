import { Photo } from "@/components/photo";
import { ReserveButton, OrderButton } from "@/components/cta";
import { SectionHead, Accent } from "@/components/section";
import { PlaceholderNote, Tbc } from "@/components/placeholder";
import { JsonLd } from "@/components/json-ld";
import { formatPrice, menu, menuSource } from "@/data/menu";
import { siteGraph } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  path: "/menu/",
  title: "Menu",
  description:
    "Steaks, starters and sides at Sterling Steak & Lounge in Park City: filet mignon, New York strip, porterhouse, weekend prime rib, bone marrow, crab cakes and more, with prices.",
});

export default function MenuPage() {
  return (
    <>
      <JsonLd data={siteGraph({ menu: true })} />

      <section className="stage-glow grain">
        <div className="container-st grid items-end gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr]">
          <SectionHead
            as="h1"
            kicker="Food menu"
            title={<>Steaks first. <Accent>Always.</Accent></>}
            lede="The current menu with published prices. Lounge bites are half price from 4 to 6 pm, Sunday to Thursday."
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ReserveButton />
            <OrderButton />
          </div>
        </div>
      </section>

      <nav aria-label="Menu sections" className="sticky top-16 z-30 border-y border-st-cream/10 bg-st-black/90 backdrop-blur md:top-20">
        <ul className="container-st flex gap-6 overflow-x-auto py-3 [scrollbar-width:none]">
          {menu.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} className="font-display text-xs tracking-[0.22em] text-st-cream/75 uppercase hover:text-st-gold-light">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-st grid gap-16 py-16 lg:grid-cols-[1fr_360px] lg:gap-20 lg:py-20">
        <div className="space-y-16">
          {menu.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-36">
              <h2 id={`${section.id}-title`} className="h-display text-3xl text-st-cream sm:text-4xl">
                {section.title}
              </h2>
              <div className="rule-gold mt-4 opacity-60" />
              {section.blurb && <p className="mt-4 text-st-mute">{section.blurb}</p>}
              {section.items.length > 0 && (
                <ul className="mt-6 divide-y divide-dashed divide-st-cream/10">
                  {section.items.map((item) => (
                    <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-4">
                      <div>
                        <p className="font-display text-xl tracking-wide text-st-cream uppercase">{item.name}</p>
                        {item.note && <p className="mt-0.5 text-sm text-st-gold-light">{item.note}</p>}
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                        {item.options.map((o, i) => (
                          <span key={i} className="text-base tabular-nums text-st-cream/90">
                            {o.label && <span className="mr-1.5 text-sm text-st-mute">{o.label}</span>}
                            {o.price === null ? <Tbc>Price to confirm</Tbc> : formatPrice(o.price)}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {section.placeholder && <PlaceholderNote className="mt-6">{section.placeholder}</PlaceholderNote>}
            </section>
          ))}

          <p className="text-xs leading-relaxed text-st-mute">
            {menuSource.label} (
            <a href={menuSource.url} className="underline underline-offset-2" rel="noopener">source</a>
            ). Menu and prices change; Sterling to confirm before launch. Items marked &ldquo;Price to confirm&rdquo; show no price on the current menu.
          </p>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <Photo name="prime-rib" sizes="(min-width: 1024px) 360px, 92vw" alt="Prime rib with horseradish cream on a white plate" className="block h-full" imgClassName="bg-st-char object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square overflow-hidden rounded-xl">
              <Photo name="tuna" sizes="(min-width: 1024px) 172px, 45vw" alt="Seared tuna plated with sauce" className="block h-full" />
            </div>
            <div className="aspect-square overflow-hidden rounded-xl">
              <Photo name="oysters" sizes="(min-width: 1024px) 172px, 45vw" alt="Shellfish served on a wooden board" className="block h-full" />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
