import Link from "next/link";
import { Check, X } from "lucide-react";
import { pageMeta } from "@/lib/meta";
import { lighthouse } from "@/data/pitch-metrics";

export const metadata = {
  ...pageMeta({
    path: "/pitch/",
    title: "The pitch: a new front of house for Sterling",
    description: "What a Front of House build changes for Sterling Steak & Lounge, compared with the current SpotHopper site, and what it costs.",
  }),
};

const CONTACT_URL = "https://fohrestaurants.com/contact?utm_source=sterling-demo&utm_medium=pitch&restaurant=Sterling%20Steak%20%26%20Lounge";

const ROWS: { area: string; now: string; demo: string; href?: string }[] = [
  {
    area: "The music",
    now: "No band or music calendar. The Events page lists promos like \"National Pasta Day\", not lineups.",
    demo: "\"Tonight on stage\" on the homepage and a weekly lineup page, edited in one file and published as Event schema.",
    href: "/music/",
  },
  {
    area: "The name",
    now: "\"Steaks\" on the site, \"Steak\" on Google, OpenTable and the sign. og:site_name literally reads \"null\".",
    demo: "\"Sterling Steak & Lounge\" everywhere, from one source, with correct Open Graph and Twitter cards.",
  },
  {
    area: "The hours",
    now: "Daily 4 to 10 pm on the site, 11 am to 10 pm on the Events page, tapas to midnight in press. Sunday brunch missing.",
    demo: "One hours record feeds every page, the schema and llms.txt. Sunday brunch has a slot waiting for your times.",
    href: "/visit/",
  },
  {
    area: "The menu",
    now: "HTML menu (good), but the Tomahawk, Ribeye and Surf & Turf show no price.",
    demo: "A full menu page with every published price, the missing ones flagged for you, and Menu schema.",
    href: "/menu/",
  },
  {
    area: "AI and search",
    now: "No JSON-LD at all: no Restaurant, hours, menu or price range. Sitemap has 7 URLs. No FAQ.",
    demo: "Restaurant, Menu, MusicEvent and FAQPage JSON-LD, a sitemap, robots.txt and an llms.txt for AI assistants.",
  },
  {
    area: "Speed",
    now: "401 KB of HTML, 21 script tags, an autoplay MP4 hero and 672 gallery image references.",
    demo: "Static pages, a curated gallery in AVIF and WebP, a still hero instead of autoplay video.",
  },
  {
    area: "Booking",
    now: "Four pop-up modals (party, reservation, order, catering) compete for the same click.",
    demo: "One Reserve button to your OpenTable in the header, the hero and a thumb bar on phones. Order goes to SpotOn.",
  },
  {
    area: "Private events",
    now: "A party room is mentioned, but there is no way to ask about a buyout.",
    demo: "A private events and buyouts page with an inquiry form for rehearsal dinners, team nights and full buyouts.",
    href: "/private-events/",
  },
  {
    area: "Ownership",
    now: "A SpotHopper template you rent. Much of the copy is generic template text.",
    demo: "Your code, your domain, your story: the House of Blues lineage and the Hagar guitar up front.",
  },
];

const NEEDS = [
  "Confirmed hours, including Sunday brunch",
  "Prices for the Tomahawk, Ribeye and Surf & Turf",
  "This month's real lineup and set times",
  "Private room capacity, minimums and event menus",
  "Gift card link",
  "A source for the \"Rated #1\" award, or we leave it off",
];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-foh-ember-deep uppercase">{children}</p>;
}

const h2 = "font-cormorant text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] font-semibold tracking-[-0.01em] text-foh-ink";
const wrap = "mx-auto max-w-[1140px] px-[clamp(1.25rem,4vw,3rem)]";
const btn = "inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[0.96rem] font-semibold transition-[background-color,box-shadow,transform] duration-200 active:translate-y-px";

export default function PitchPage() {
  return (
    <>
      <section className="py-[clamp(3.5rem,8vw,6.5rem)]">
        <div className={wrap}>
          <Kicker>Prepared for Jackson and Lance Sterling</Kicker>
          <h1 className="mt-5 max-w-4xl font-cormorant text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.08] font-bold tracking-[-0.01em] text-foh-ink">
            Your room is loud. Your website should be <em className="font-semibold text-foh-ember">too</em>.
          </h1>
          <p className="mt-6 max-w-[56ch] text-[clamp(1.05rem,1.6vw,1.28rem)] leading-[1.65]">
            This is a working concept for Sterling Steak &amp; Lounge, built from public research on October 9, 2026. Same photos, same OpenTable,
            same SpotOn. The difference: the music leads, the facts agree with each other, and you own the site.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={CONTACT_URL} className={`${btn} bg-foh-ember-deep text-white hover:bg-[#8f3a22] hover:shadow-[0_10px_22px_rgba(199,91,57,.28)]`}>
              Start the conversation
            </a>
            <Link href="/" className={`${btn} border border-foh-line text-foh-ink hover:border-foh-ink`}>
              Walk the demo
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-foh-bone py-[clamp(3.5rem,8vw,6.5rem)]" aria-labelledby="compare-title">
        <div className={wrap}>
          <Kicker>What changes</Kicker>
          <h2 id="compare-title" className={`${h2} mt-4`}>
            The current site, and the <em className="text-foh-ember">fix</em>.
          </h2>
          <p className="mt-4 max-w-[60ch] leading-[1.65]">From our audit of sterlingsteakandlounge.com. Every row links to the page in this demo that shows the fix.</p>

          {/* Below md each row is its own full-width card; from md up the rows join into one table. */}
          <div className="-mx-3 mt-10 md:mx-0 md:overflow-hidden md:rounded-[14px] md:border md:border-foh-line md:bg-white md:shadow-[0_1px_2px_rgba(34,28,24,.05),0_8px_28px_rgba(34,28,24,.07)]">
            <div className="hidden grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 border-b border-foh-line bg-foh-paper px-6 py-3 text-[0.72rem] font-semibold tracking-[0.18em] text-foh-body uppercase md:grid">
              <span>Area</span>
              <span>Today</span>
              <span>In this demo</span>
            </div>
            <ul className="flex flex-col gap-3 md:gap-0 md:divide-y md:divide-foh-line">
              {ROWS.map((r) => (
                <li
                  key={r.area}
                  data-testid="compare-row"
                  className="block w-full rounded-[14px] border border-foh-line bg-white p-5 shadow-[0_1px_2px_rgba(34,28,24,.05),0_8px_28px_rgba(34,28,24,.07)] md:grid md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-6 md:rounded-none md:border-0 md:px-6 md:shadow-none"
                >
                  <p className="font-cormorant text-2xl font-semibold text-foh-ink md:text-xl">{r.area}</p>
                  <div className="mt-3 md:mt-0">
                    <p className="mb-1.5 text-[0.68rem] font-semibold tracking-[0.18em] text-foh-body uppercase md:hidden">Today</p>
                    <p className="flex gap-2.5 text-[0.95rem] leading-relaxed">
                      <X className="mt-1 size-4 shrink-0 text-foh-body/60" aria-hidden />
                      <span className="min-w-0">{r.now}</span>
                    </p>
                  </div>
                  <div className="mt-4 border-t border-foh-line pt-4 md:mt-0 md:border-0 md:pt-0">
                    <p className="mb-1.5 text-[0.68rem] font-semibold tracking-[0.18em] text-foh-ember-deep uppercase md:hidden">In this demo</p>
                    <p className="flex gap-2.5 text-[0.95rem] leading-relaxed text-foh-ink">
                      <Check className="mt-1 size-4 shrink-0 text-foh-ember-deep" aria-hidden />
                      <span className="min-w-0">
                        {r.demo}{" "}
                        {r.href && (
                          <Link href={r.href} className="font-semibold text-foh-ember-deep underline-offset-4 hover:underline">
                            See it<span className="sr-only">: {r.area.toLowerCase()}</span>
                          </Link>
                        )}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-sm">
            {lighthouse
              ? `Lighthouse on this demo's homepage, mobile, measured ${lighthouse.date}: Performance ${lighthouse.performance}, Accessibility ${lighthouse.accessibility}, Best Practices ${lighthouse.bestPractices}, and SEO ${lighthouse.seoWithoutNoindex} once the demo's noindex tag comes off. `
              : ""}
            The current site&apos;s scores could not be captured during research (PageSpeed quota), so we&apos;ll run both side by side on a call.
          </p>
        </div>
      </section>

      <section className="py-[clamp(3.5rem,8vw,6.5rem)]" aria-labelledby="offer-title">
        <div className={wrap}>
          <Kicker>The offer</Kicker>
          <h2 id="offer-title" className={`${h2} mt-4`}>
            Own it. Don&apos;t <em className="text-foh-ember">rent</em> it.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-[14px] border border-foh-line bg-white p-7 shadow-[0_1px_2px_rgba(34,28,24,.05),0_8px_28px_rgba(34,28,24,.07)]">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-foh-body uppercase">Custom build</p>
              <p className="mt-3 font-cormorant text-5xl font-bold text-foh-ink">From $2,000</p>
              <p className="mt-1 font-semibold text-foh-ink">You own the code.</p>
              <ul className="mt-6 space-y-2.5 text-[0.95rem]">
                {["Homepage with Tonight on stage", "Menu, music, private events and visit pages", "Restaurant, Menu, Event and FAQ schema, plus llms.txt", "Reserve to OpenTable, Order to SpotOn", "Events inquiry form wired to your inbox"].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-foh-ember-deep" aria-hidden />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border-2 border-foh-brass bg-foh-ink p-7 text-foh-muted-on-ink shadow-[0_2px_6px_rgba(34,28,24,.08),0_22px_50px_rgba(34,28,24,.14)]">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-foh-brass uppercase">Care+ &middot; recommended</p>
              <p className="mt-3 font-cormorant text-5xl font-bold text-foh-paper">$900<span className="text-2xl font-semibold">/yr</span></p>
              <p className="mt-1 font-semibold text-foh-paper">You own it. We keep it sharp.</p>
              <ul className="mt-6 space-y-2.5 text-[0.95rem]">
                {["Weekly lineup updates, so Tonight on stage is never stale", "Menu and price changes", "Hours and brunch kept in sync everywhere", "Schema and llms.txt kept current"].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-foh-brass" aria-hidden />{t}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm">Or Care at $450/yr ($45/mo) for lighter upkeep.</p>
            </div>
          </div>
          <p className="mt-6 max-w-[64ch] text-sm leading-relaxed">
            Booking and an AI host are custom add-ons, quoted after a call. We don&apos;t guarantee AI assistants will recommend you; we make
            sure they can read the right facts.
          </p>
        </div>
      </section>

      <section className="bg-foh-bone py-[clamp(2.5rem,5vw,4rem)]" aria-labelledby="needs-title">
        <div className={`${wrap} grid gap-8 md:grid-cols-[1fr_1.4fr]`}>
          <div>
            <Kicker>Before launch</Kicker>
            <h2 id="needs-title" className={`${h2} mt-4`}>What we need from <em className="text-foh-ember">you</em>.</h2>
            <p className="mt-4 leading-[1.65]">Anything unverified in the demo is marked &ldquo;to confirm&rdquo;. Nothing is invented: no prices, reviews or quotes.</p>
          </div>
          <ul className="grid gap-3 self-center sm:grid-cols-2">
            {NEEDS.map((n) => (
              <li key={n} className="rounded-[9px] border border-foh-line bg-white px-4 py-3 text-[0.95rem] text-foh-ink">{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-foh-dusk py-[clamp(3.5rem,8vw,6.5rem)] text-foh-muted-on-ink">
        <div className={`${wrap} text-center`}>
          <h2 className="font-cormorant text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] font-semibold text-foh-paper">
            Let&apos;s build your front of <em className="text-foh-ember-bright">house</em>.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch]">Drew Traldi, Front of House. Built only for restaurants.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={CONTACT_URL} className={`${btn} bg-foh-ember-deep text-white hover:bg-[#8f3a22]`}>Start the conversation</a>
            <a href="https://fohrestaurants.com/pricing" className={`${btn} bg-foh-paper text-foh-ink hover:bg-white`}>See pricing</a>
          </div>
          <p className="mt-6 text-sm">
            <a href="mailto:hello@fohrestaurants.com" className="text-foh-paper underline-offset-4 hover:underline">hello@fohrestaurants.com</a> &middot;{" "}
            <a href="tel:+17703642664" className="text-foh-paper underline-offset-4 hover:underline">(770) 364-2664</a>
          </p>
        </div>
      </section>
    </>
  );
}
