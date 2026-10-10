import { cn } from "@/lib/utils";

export function PlaceholderNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("rounded-md border border-dashed border-st-gold/40 bg-st-gold/5 px-4 py-3 text-sm text-st-mute", className)}>
      <span className="mr-2 font-semibold text-st-gold-light">Placeholder.</span>
      {children}
    </p>
  );
}
