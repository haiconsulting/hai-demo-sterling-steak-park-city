import { cn } from "@/lib/utils";

/**
 * Visible marker for any fact that is not yet verified. Keeps the demo honest:
 * nothing unconfirmed reads as if it were confirmed.
 */
export function Tbc({ children = "To confirm", className, title }: { children?: React.ReactNode; className?: string; title?: string }) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-dashed border-st-gold/60 px-1.5 py-0.5 align-middle font-sans text-[0.68rem] font-medium tracking-wide text-st-gold-light uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PlaceholderNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("rounded-md border border-dashed border-st-gold/40 bg-st-gold/5 px-4 py-3 text-sm text-st-mute", className)}>
      <span className="mr-2 font-semibold text-st-gold-light">Placeholder.</span>
      {children}
    </p>
  );
}
