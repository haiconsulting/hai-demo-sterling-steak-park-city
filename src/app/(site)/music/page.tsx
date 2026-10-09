import { Guitar, Mail } from "lucide-react";
import { Photo } from "@/components/photo";
import { ReserveButton } from "@/components/cta";
import { SectionHead, Accent } from "@/components/section";
import { TonightCard, WeekLineup, SampleBadge } from "@/components/lineup";
import { PlaceholderNote } from "@/components/placeholder";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { LINEUP_IS_SAMPLE } from "@/data/lineup";
import { siteGraph } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  path: "/music/",
  title: "Live music tonight",
  description:
    "Who's playing at Sterling Steak & Lounge in Park City. Live music 7 nights a week with a house band playing mostly '70s and '80s rock.",
});

export default function MusicPage() {
  return (
    <>
      <JsonLd data={siteGraph({ events: true })} />

      <section className="stage-glow grain overflow-hidden">
        <div className="container-st grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead
              as="h1"
              kicker="On stage"
              title={<>Live music, seven <Accent>nights.</Accent></>}
              lede={site.story.music}
            />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ReserveButton label="Book a table for the show" />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-[2rem] border border-st-cream/10">
              <Photo name="lounge" sizes="(min-width: 1024px) 520px, 92vw" alt="The Sterling lounge during a live set" className="block h-full" />
            </div>
            <TonightCard className="relative -mt-20 mx-4 sm:mx-8 lg:absolute lg:-bottom-6 lg:-left-8 lg:mx-0 lg:w-80" />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24" aria-labelledby="week-title">
        <div className="container-st">
          <p className="kicker-st flex items-center gap-3">This week <SampleBadge /></p>
          <h2 id="week-title" className="h-display mt-4 text-4xl text-st-cream sm:text-5xl">The lineup</h2>
          {LINEUP_IS_SAMPLE && (
            <PlaceholderNote className="mt-6 max-w-3xl">
              Acts and set times shown are sample data for this demo, not confirmed bookings. The real lineup is edited in{" "}
              <code className="rounded bg-st-cream/10 px-1.5 py-0.5 text-st-cream">src/data/lineup.ts</code>, one line per night, and
              feeds this page, the homepage card and the Event schema search engines read.
            </PlaceholderNote>
          )}
          <WeekLineup className="mt-10" />
        </div>
      </section>

      <section className="grain bg-st-char py-20 md:py-24">
        <div className="container-st grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <SectionHead
              kicker="Music runs in the family"
              title={<>Built by a venue <Accent>man.</Accent></>}
              lede={site.story.lineage}
            />
            <ul className="mt-8 space-y-3">
              {site.story.room.map((r) => (
                <li key={r} className="flex items-start gap-3 text-st-cream/85">
                  <Guitar className="mt-1 size-4 shrink-0 text-st-gold" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-st-mute">
              <Mail className="size-4 text-st-gold" aria-hidden />
              Musicians and booking:{" "}
              <a href={`mailto:${site.email}?subject=Booking%20inquiry`} className="break-all text-st-gold-light underline-offset-4 hover:underline">
                {site.email}
              </a>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl">
              <Photo name="house-band" sizes="(min-width: 1024px) 280px, 45vw" alt="A performer at the microphone" className="block h-full" />
            </div>
            <div className="mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
              <Photo name="dining" sizes="(min-width: 1024px) 280px, 45vw" alt="The Sterling dining room with an antler chandelier and portraits on the walls" className="block h-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
