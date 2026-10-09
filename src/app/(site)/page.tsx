import Link from "next/link";
import { ArrowRight, Guitar, MapPin, Users } from "lucide-react";
import { Photo } from "@/components/photo";
import { ReserveButton, OrderButton } from "@/components/cta";
import { TonightCard, WeekLineup, SampleBadge } from "@/components/lineup";
import { SectionHead, Accent } from "@/components/section";
import { HoursList } from "@/components/hours";
import { JsonLd } from "@/components/json-ld";
import { fullAddress, site } from "@/data/site";
import { formatPrice, menu } from "@/data/menu";
import { siteGraph } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ path: "/" });

const MARQUEE = [
  "Live music 7 nights",
  "'70s and '80s rock",
  "Copper bar",
  "Collectible guitars",
  "Patio on the Swaner Preserve",
  "Kimball Junction",
];

const steaks = menu.find((s) => s.id === "steaks")!.items.filter((i) => i.options.some((o) => o.price !== null)).slice(0, 4);

export default function Home() {
  return (
    <>
      <JsonLd data={siteGraph({ events: true, menu: true })} />

      {/* HERO */}
      <section className="stage-glow grain relative overflow-hidden">
        <div className="container-st grid items-center gap-12 pt-10 pb-16 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
          <div>
            <p className="kicker-st">Kimball Junction &middot; Park City, Utah</p>
            <h1 className="h-display mt-5 text-[3.4rem] text-st-cream sm:text-7xl xl:text-[5.6rem]">
              Steaks.
              <br />
              Live <Accent>rock.</Accent>
              <br />
              Seven nights.
            </h1>
            <div data-hero-ctas className="mt-8 flex flex-wrap gap-3">
              <ReserveButton size="lg" />
              <OrderButton size="lg" />
            </div>
            <TonightCard className="mt-8 lg:hidden" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-st-cream/80 sm:text-lg">
              Jackson and Lance Sterling&apos;s steakhouse and lounge. Live music every night of the week, a house band raised on
              &apos;70s and &apos;80s rock, and a copper bar under walls of collectible guitars.
            </p>
            <Link href="/music/" className="mt-6 inline-flex items-center gap-2 text-sm text-st-gold-light underline-offset-4 hover:underline">
              See who&apos;s playing this week <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-st-cream/10 sm:aspect-square lg:aspect-[4/5]">
              <Photo
                name="lounge"
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 448px, 92vw"
                alt="Guests at their tables in the Sterling lounge while a performer is on stage"
                className="block h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-st-black via-st-black/10 to-transparent" />
            </div>
            <TonightCard className="absolute -bottom-8 -left-10 hidden w-[22rem] lg:block" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-st-gold/25 bg-st-oxblood py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-sm tracking-[0.3em] text-st-cream/90 uppercase">
              {m} <span className="text-st-gold">&#9733;</span>
            </span>
          ))}
        </div>
      </div>

      {/* THIS WEEK */}
      <section className="py-20 md:py-28" aria-labelledby="week-title">
        <div className="container-st">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="kicker-st flex items-center gap-3">This week on stage <SampleBadge /></p>
              <h2 id="week-title" className="h-display mt-4 text-4xl text-st-cream sm:text-5xl">
                Every night has a <Accent>band.</Accent>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-st-mute sm:text-lg">
                The lineup lives in one file, so it changes as fast as the bookings do.
              </p>
            </div>
            <Link href="/music/" className="inline-flex items-center gap-2 font-display text-sm tracking-[0.2em] text-st-gold-light uppercase hover:text-st-cream">
              Full lineup <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <WeekLineup className="mt-10" />
        </div>
      </section>

      {/* STORY */}
      <section className="grain bg-st-char py-20 md:py-28" aria-labelledby="story-title">
        <div className="container-st grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl">
              <Photo name="house-band" sizes="(min-width: 1024px) 280px, 45vw" alt="A performer laughing at the microphone in the Sterling lounge" className="block h-full" />
            </div>
            <div className="mt-12 aspect-[3/4] overflow-hidden rounded-2xl">
              <Photo name="bartender" sizes="(min-width: 1024px) 280px, 45vw" alt="A Sterling bartender pouring a drink behind the bar" className="block h-full" />
            </div>
          </div>
          <div>
            <SectionHead
              kicker="The story"
              title={<>From the House of Blues to <Accent>Kimball Junction.</Accent></>}
              lede={site.story.lineage}
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {site.story.room.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-st-cream/85">
                  <Guitar className="mt-0.5 size-4 shrink-0 text-st-gold" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="py-20 md:py-28" aria-labelledby="menu-title">
        <div className="container-st grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="kicker-st">From the grill</p>
            <h2 id="menu-title" className="h-display mt-4 text-4xl text-st-cream sm:text-5xl">
              The cuts, with the <Accent>prices.</Accent>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-st-mute sm:text-lg">
              Cuts, sizes and prices on one page, so there&apos;s no guessing before you book.
            </p>
            <ul className="mt-8 divide-y divide-st-cream/10 border-y border-st-cream/10">
              {steaks.map((s) => (
                <li key={s.name} className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-display text-lg tracking-wide text-st-cream uppercase">{s.name}</span>
                  <span className="text-sm tabular-nums text-st-gold-light">
                    {s.options.map((o) => `${o.label ? `${o.label} ` : ""}${formatPrice(o.price)}`).join(" / ")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu/" className="inline-flex h-11 items-center gap-2 rounded-full border border-st-gold px-6 font-display text-sm tracking-[0.18em] text-st-gold-light uppercase transition-colors hover:bg-st-gold hover:text-st-black">
                Full menu <ArrowRight className="size-4" aria-hidden />
              </Link>
              <OrderButton />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/2] overflow-hidden rounded-[2rem]">
              <Photo name="ribeye" sizes="(min-width: 1024px) 600px, 92vw" alt="Grilled ribeye with herb butter, a glass of red wine beside it" className="block h-full" />
            </div>
            <div className="absolute -bottom-8 -left-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-st-black sm:block md:w-52">
              <Photo name="tuna" sizes="208px" alt="Seared tuna plated with sauce on a long white dish" className="block aspect-square" />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section aria-label="Photos from Sterling" className="pb-20 md:pb-28">
        <div className="container-st grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["cocktail", "A guest smiling with a pink cocktail at the bar"],
              ["calamari", "Fried calamari with lemon and two dipping sauces"],
              ["oysters", "Shellfish served on a wooden board"],
              ["baked-potato", "Loaded baked potato with bacon and green onion"],
            ] as const
          ).map(([name, alt]) => (
            <div key={name} className="aspect-square overflow-hidden rounded-xl">
              <Photo name={name} sizes="(min-width: 640px) 25vw, 50vw" alt={alt} className="block h-full" imgClassName="transition-transform duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="relative overflow-hidden border-y border-st-gold/20 bg-st-oxblood py-20" aria-labelledby="reviews-title">
        <div className="container-st">
          <h2 id="reviews-title" className="kicker-st text-st-gold-light">In guests&apos; words</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {site.reviews.map((r) => (
              <figure key={r.quote}>
                <blockquote className="font-slab text-3xl leading-tight text-st-cream sm:text-4xl">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-st-cream/70">{r.source}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVATE EVENTS */}
      <section className="py-20 md:py-28" aria-labelledby="events-title">
        <div className="container-st grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <SectionHead
              kicker="Private events and buyouts"
              title={<>Bring the whole <Accent>crew.</Accent></>}
              lede="Rehearsal dinners, team nights, birthdays and full buyouts, with a stage already in the room."
            />
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-st-cream/10 bg-st-char p-5">
                <dt className="flex items-center gap-2 text-xs tracking-widest text-st-mute uppercase"><Users className="size-4 text-st-gold" aria-hidden /> Dining room</dt>
                <dd className="mt-2 font-display text-2xl text-st-cream uppercase">Seats {site.seating.dining}</dd>
              </div>
              <div className="rounded-xl border border-st-cream/10 bg-st-char p-5">
                <dt className="flex items-center gap-2 text-xs tracking-widest text-st-mute uppercase"><Users className="size-4 text-st-gold" aria-hidden /> Lounge</dt>
                <dd className="mt-2 font-display text-2xl text-st-cream uppercase">{site.seating.lounge}</dd>
              </div>
            </dl>
            <Link href="/private-events/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-st-gold px-7 font-display text-sm tracking-[0.18em] text-st-black uppercase transition-colors hover:bg-st-gold-light">
              Plan an event <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="order-1 aspect-[4/3] overflow-hidden rounded-[2rem] lg:order-2">
            <Photo name="toast" sizes="(min-width: 1024px) 560px, 92vw" alt="Friends raising glasses over shared plates at a Sterling table" className="block h-full" />
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section className="grain bg-st-char py-20 md:py-24" aria-labelledby="visit-title">
        <div className="container-st grid gap-12 md:grid-cols-2">
          <div>
            <p className="kicker-st">Visit</p>
            <h2 id="visit-title" className="h-display mt-4 text-4xl text-st-cream sm:text-5xl">
              Newpark, <Accent>Kimball Junction.</Accent>
            </h2>
            <p className="mt-5 flex items-start gap-3 text-base leading-relaxed text-st-cream/85">
              <MapPin className="mt-1 size-4 shrink-0 text-st-gold" aria-hidden />
              <span>
                {fullAddress}
                <br />
                <span className="text-st-mute">{site.patio}.</span>
              </span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ReserveButton />
              <a href={site.mapsUrl} target="_blank" rel="noopener" className="inline-flex h-11 items-center rounded-full border border-st-cream/30 px-6 font-display text-sm tracking-[0.18em] text-st-cream uppercase hover:border-st-gold hover:text-st-gold-light">
                Directions
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-st-cream/10 bg-st-black/50 p-6 sm:p-8">
            <h3 className="kicker-st">Hours</h3>
            <HoursList className="mt-5" />
          </div>
        </div>
      </section>
    </>
  );
}
