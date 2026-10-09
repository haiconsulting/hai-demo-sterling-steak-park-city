import { CalendarCheck, Phone, ShoppingBag } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display text-sm font-medium tracking-[0.18em] uppercase transition-[background-color,color,box-shadow,transform] duration-200 active:translate-y-px";

const sizes = {
  md: "h-11 px-6",
  lg: "h-13 px-8 text-[0.95rem]",
};

export function ReserveButton({ size = "md", className, label = "Reserve a table" }: { size?: keyof typeof sizes; className?: string; label?: string }) {
  return (
    <a
      href={site.links.reserve}
      target="_blank"
      rel="noopener"
      className={cn(base, sizes[size], "bg-st-gold text-st-black shadow-[0_8px_30px_-8px_rgb(165_132_90/0.6)] hover:bg-st-gold-light", className)}
    >
      <CalendarCheck className="size-4" aria-hidden />
      {label}
      <span className="sr-only">on OpenTable (opens in a new tab)</span>
    </a>
  );
}

export function OrderButton({ size = "md", className, label = "Order pickup" }: { size?: keyof typeof sizes; className?: string; label?: string }) {
  return (
    <a
      href={site.links.order}
      target="_blank"
      rel="noopener"
      className={cn(base, sizes[size], "border border-st-cream/30 text-st-cream hover:border-st-gold hover:text-st-gold-light", className)}
    >
      <ShoppingBag className="size-4" aria-hidden />
      {label}
      <span className="sr-only">on SpotOn (opens in a new tab)</span>
    </a>
  );
}

export function CallLink({ className }: { className?: string }) {
  return (
    <a href={`tel:${site.phone.e164}`} className={cn("inline-flex items-center gap-2 hover:text-st-gold-light", className)}>
      <Phone className="size-4" aria-hidden />
      {site.phone.display}
    </a>
  );
}
