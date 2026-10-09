import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileActionBar } from "@/components/action-bar";
import { DemoPill } from "@/components/foh/demo-pill";
import { IS_DEMO } from "@/lib/meta";
import { sterlingFonts } from "../fonts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={sterlingFonts}>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <MobileActionBar />
      {IS_DEMO && <DemoPill />}
    </div>
  );
}
