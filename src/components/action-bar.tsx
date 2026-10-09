import { CalendarCheck, Phone, ShoppingBag } from "lucide-react";
import { site } from "@/data/site";

/** Thumb-reach Reserve / Order / Call bar on phones. */
export function MobileActionBar() {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 font-display text-[0.7rem] tracking-[0.2em] uppercase";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-st-cream/10 bg-st-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <a href={site.links.reserve} target="_blank" rel="noopener" className={`${item} bg-st-gold text-st-black`}>
        <CalendarCheck className="size-5" aria-hidden />
        Reserve
      </a>
      <a href={site.links.order} target="_blank" rel="noopener" className={`${item} text-st-cream`}>
        <ShoppingBag className="size-5" aria-hidden />
        Order
      </a>
      <a href={`tel:${site.phone.e164}`} className={`${item} text-st-cream`}>
        <Phone className="size-5" aria-hidden />
        Call
      </a>
    </nav>
  );
}
