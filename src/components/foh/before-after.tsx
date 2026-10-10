import { Check, X } from "lucide-react";
import { Photo, type PhotoName } from "@/components/photo";
import manifest from "@/data/images.generated.json";
import { asset } from "@/lib/paths";

type Side = {
  key: "current" | "demo";
  label: string;
  url: string;
  caption: string;
  desktop: PhotoName;
  mobile: PhotoName;
};

const SIDES: Side[] = [
  {
    key: "current",
    label: "Today",
    url: "sterlingsteakandlounge.com",
    caption: "A pop-up covers the first screen on desktop and on phones. No lineup, no prices.",
    desktop: "pitch-current-desktop",
    mobile: "pitch-current-mobile",
  },
  {
    key: "demo",
    label: "This demo",
    url: "Sterling, rebuilt by FOH",
    caption: "Tonight's band, Reserve and Order on the first screen. Nothing in the way.",
    desktop: "pitch-demo-desktop",
    mobile: "pitch-demo-mobile",
  },
];

function BrowserFrame({ side }: { side: Side }) {
  return (
    <div className="overflow-hidden rounded-[9px] border border-foh-line bg-white shadow-[0_2px_6px_rgba(34,28,24,.08),0_22px_50px_rgba(34,28,24,.14)]">
      <div className="flex items-center gap-1.5 border-b border-foh-line bg-foh-paper px-3 py-2" aria-hidden>
        <span className="size-2 rounded-full bg-foh-line" />
        <span className="size-2 rounded-full bg-foh-line" />
        <span className="size-2 rounded-full bg-foh-line" />
        <span className="ml-2 truncate text-[0.68rem] text-foh-body">{side.url}</span>
      </div>
      <DesktopShot name={side.desktop} alt={`${side.label}: the homepage on a desktop screen`} />
    </div>
  );
}

/**
 * Above the fold on desktop, hidden on phones. The sources only match from
 * 768px, so phones fetch a 1px placeholder instead of the desktop capture,
 * while desktop gets it eagerly.
 */
function DesktopShot({ name, alt }: { name: PhotoName; alt: string }) {
  const m = manifest[name];
  const set = (ext: string) => m.widths.map((w) => `${asset(`/img/${name}-${w}.${ext}`)} ${w}w`).join(", ");
  const sizes = "(min-width: 1140px) 520px, 45vw";
  return (
    <picture className="block aspect-[16/10]">
      <source media="(min-width: 768px)" type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source media="(min-width: 768px)" type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt={alt}
        width={m.width}
        height={m.height}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </picture>
  );
}

function PhoneFrame({ side, className = "" }: { side: Side; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.4rem] border-[5px] border-foh-ink bg-foh-ink shadow-[0_22px_50px_rgba(34,28,24,.25)] ${className}`}>
      <Photo
        name={side.mobile}
        sizes="(min-width: 768px) 130px, 150px"
        alt={`${side.label}: the homepage on a phone`}
        className="block aspect-[390/844]"
        imgClassName="object-top"
      />
    </div>
  );
}

/** Above-the-fold captures of the current site and this demo, desktop and phone. */
export function BeforeAfter() {
  return (
    <div data-before-after className="mt-10 grid grid-cols-2 gap-4 md:gap-8" role="group" aria-label="Before and after: the current site and this demo">
      {SIDES.map((side) => (
        <figure key={side.key} data-side={side.key} className="min-w-0">
          <figcaption className="mb-3 flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.18em] uppercase">
            {side.key === "current" ? (
              <X className="size-4 text-foh-body" aria-hidden />
            ) : (
              <Check className="size-4 text-foh-ember-deep" aria-hidden />
            )}
            <span className={side.key === "current" ? "text-foh-body" : "text-foh-ember-deep"}>{side.label}</span>
          </figcaption>
          {/* Phones: the two phone captures side by side. Wider: browser frame with the phone overlapping. */}
          <PhoneFrame side={side} className="mx-auto max-w-[150px] md:hidden" />
          <div className="relative hidden pr-10 pb-10 md:block">
            <BrowserFrame side={side} />
            <PhoneFrame side={side} className="absolute right-0 bottom-0 w-[24%] min-w-[96px]" />
          </div>
          <p className="mt-3 text-[0.88rem] leading-snug text-foh-body md:max-w-[38ch]">{side.caption}</p>
        </figure>
      ))}
    </div>
  );
}
