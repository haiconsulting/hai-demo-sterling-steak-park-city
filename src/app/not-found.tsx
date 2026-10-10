import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Accent } from "@/components/section";
import { ReserveButton } from "@/components/cta";

export default function NotFound() {
  return (
    <div>
      <SiteHeader lazyLogo />
      <main id="main" className="stage-glow grain">
        <div className="container-st py-28 text-center md:py-40">
          <p className="kicker-st">404</p>
          <h1 className="h-display mt-5 text-5xl text-st-cream sm:text-7xl">
            Wrong <Accent>stage.</Accent>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-st-mute">That page isn&apos;t on the setlist. The band, the menu and a table are all one click away.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-11 items-center rounded-full border border-st-cream/30 px-6 font-display text-sm tracking-[0.18em] text-st-cream uppercase hover:border-st-gold">
              Back home
            </Link>
            <ReserveButton />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
