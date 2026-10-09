import { Mic2, Users, Utensils, Wine } from "lucide-react";
import { Photo } from "@/components/photo";
import { SectionHead, Accent } from "@/components/section";
import { EventInquiryForm } from "@/components/event-inquiry-form";
import { PlaceholderNote } from "@/components/placeholder";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { siteGraph } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  path: "/private-events/",
  title: "Private events and buyouts",
  description:
    "Rehearsal dinners, corporate events, private party room and full buyouts at Sterling Steak & Lounge, Kimball Junction, Park City. Seats about 150 dining plus 80 to 100 in the lounge.",
});

const FORMATS = [
  { icon: Wine, title: "Private party room", body: "A room of your own for birthdays, family dinners and smaller groups." },
  { icon: Utensils, title: "Rehearsal dinners", body: "Steaks and toasts the night before the big day." },
  { icon: Users, title: "Corporate and team nights", body: "Client dinners, offsites and holiday parties in Kimball Junction." },
  { icon: Mic2, title: "Full buyouts", body: `The whole place: dining room for about ${site.seating.dining.replace("about ", "")} and a lounge for ${site.seating.lounge}, stage included.` },
];

export default function PrivateEventsPage() {
  return (
    <>
      <JsonLd data={siteGraph()} />

      <section className="stage-glow grain overflow-hidden">
        <div className="container-st grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
          <SectionHead
            as="h1"
            kicker="Private events and buyouts"
            title={<>Your night, our <Accent>stage.</Accent></>}
            lede="Tell us the date, the headcount and the occasion. The Sterling team will come back with options for the room, the menu and the music."
          />
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-st-cream/10">
            <Photo name="toast" sizes="(min-width: 1024px) 520px, 92vw" alt="Friends raising glasses over shared plates" className="block h-full" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-label="Event formats">
        <div className="container-st grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-st-cream/10 bg-st-char p-6">
              <Icon className="size-6 text-st-gold" aria-hidden />
              <h2 className="mt-4 font-display text-xl tracking-wide text-st-cream uppercase">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-st-mute">{body}</p>
            </div>
          ))}
        </div>
        <div className="container-st mt-6">
          <PlaceholderNote>
            Room capacities, minimums and event menus are to be confirmed with Sterling. Seating figures come from press coverage.
          </PlaceholderNote>
        </div>
      </section>

      <section id="inquire" className="grain scroll-mt-24 bg-st-char/60 py-16 md:py-24" aria-labelledby="inquire-title">
        <div className="container-st grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="kicker-st">Inquire</p>
            <h2 id="inquire-title" className="h-display mt-4 text-4xl text-st-cream sm:text-5xl">
              Start with a <Accent>date.</Accent>
            </h2>
            <p className="mt-5 text-st-mute">
              Prefer to talk it through? Call{" "}
              <a href={`tel:${site.phone.e164}`} className="text-st-gold-light underline-offset-4 hover:underline">{site.phone.display}</a> or email{" "}
              <a href={`mailto:${site.email}`} className="break-all text-st-gold-light underline-offset-4 hover:underline">{site.email}</a>.
            </p>
            <div className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block">
              <Photo name="dining" sizes="420px" alt="The Sterling dining room set for service" className="block h-full" />
            </div>
          </div>
          <EventInquiryForm />
        </div>
      </section>
    </>
  );
}
