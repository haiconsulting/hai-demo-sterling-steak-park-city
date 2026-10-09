import { cn } from "@/lib/utils";

export function SectionHead({
  kicker,
  title,
  lede,
  className,
  as: Tag = "h2",
}: {
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="kicker-st">{kicker}</p>
      <Tag className={cn("h-display mt-4 text-st-cream", Tag === "h1" ? "text-5xl sm:text-6xl md:text-7xl" : "text-4xl sm:text-5xl")}>{title}</Tag>
      {lede && <p className="mt-5 text-base leading-relaxed text-st-mute sm:text-lg">{lede}</p>}
    </div>
  );
}

/** One accent word per headline, set in the slab face from Sterling's wordmark. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="font-slab font-semibold tracking-normal text-st-gold normal-case">{children}</span>;
}
