"use client";

import { useSyncExternalStore } from "react";
import { Music2 } from "lucide-react";
import { DAYS, formatTime, type DayCode } from "@/data/site";
import { LINEUP_IS_SAMPLE, parkCityToday, specialDates, weeklyLineup, type Act } from "@/data/lineup";
import { cn } from "@/lib/utils";

const WEEK: DayCode[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const subscribe = () => () => {};

/** Park City's current day on the client; null during prerender. */
function useTonight(): { iso: string; day: DayCode } | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      const t = parkCityToday();
      return CACHE.get(t.iso) ?? (CACHE.set(t.iso, t), t);
    },
    () => null,
  );
}
const CACHE = new Map<string, { iso: string; day: DayCode }>();

function actFor(t: { iso: string; day: DayCode }): Act {
  return specialDates[t.iso] ?? weeklyLineup[t.day];
}

export function SampleBadge({ className }: { className?: string }) {
  if (!LINEUP_IS_SAMPLE) return null;
  return (
    <span
      title="Sample lineup for the demo. Edit src/data/lineup.ts"
      className={cn("rounded-sm border border-dashed border-st-gold/60 px-1.5 py-0.5 font-sans text-[0.62rem] font-semibold tracking-wider text-st-gold-light uppercase", className)}
    >
      Sample lineup
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative flex size-2.5" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-st-live opacity-60" />
      <span className="relative inline-flex size-2.5 rounded-full bg-st-live" />
    </span>
  );
}

export function TonightCard({ className }: { className?: string }) {
  const tonight = useTonight();
  const act = tonight ? actFor(tonight) : null;
  const dayName = tonight ? DAYS.find((d) => d.code === tonight.day)!.name : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-st-cream/15 bg-st-black/80 p-5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md",
        className,
      )}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-display text-xs tracking-[0.3em] text-st-cream uppercase">
          <LiveDot /> Tonight on stage
        </p>
        <SampleBadge />
      </div>
      {act ? (
        <>
          <p className="mt-4 font-display text-2xl leading-tight font-semibold tracking-wide text-st-cream uppercase">{act.act}</p>
          <p className="mt-1 text-sm text-st-mute">
            {dayName} &middot; {act.style}
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-st-gold-light">
            <Music2 className="size-4" aria-hidden />
            <span className="tabular-nums">
              {formatTime(act.start)} to {formatTime(act.end)}
            </span>
            <span className="text-st-mute">&middot; {act.room}</span>
          </p>
        </>
      ) : (
        <div className="mt-4 space-y-2" aria-label="Loading tonight's set">
          <div className="h-7 w-4/5 animate-pulse rounded bg-st-cream/10" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-st-cream/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-st-cream/10" />
        </div>
      )}
    </div>
  );
}

export function WeekLineup({ className }: { className?: string }) {
  const tonight = useTonight();
  return (
    <ol className={cn("divide-y divide-st-cream/10 border-y border-st-cream/10", className)}>
      {WEEK.map((code) => {
        const isTonight = tonight?.day === code;
        const act = isTonight && tonight ? actFor(tonight) : weeklyLineup[code];
        const day = DAYS.find((d) => d.code === code)!;
        return (
          <li
            key={code}
            id={`night-${code.toLowerCase()}`}
            className={cn(
              "grid grid-cols-[4.5rem_1fr] items-center gap-x-4 gap-y-1 py-5 transition-colors sm:grid-cols-[7rem_1fr_auto] sm:gap-x-8",
              isTonight && "bg-gradient-to-r from-st-oxblood/70 via-st-oxblood/20 to-transparent",
            )}
          >
            <div className="pl-3 sm:pl-4">
              <p className={cn("font-display text-lg tracking-[0.18em] uppercase sm:text-xl", isTonight ? "text-st-cream" : "text-st-gold")}>{day.name.slice(0, 3)}</p>
              {isTonight && <p className="mt-0.5 font-sans text-[0.62rem] font-semibold tracking-widest text-st-live uppercase">Tonight</p>}
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight font-medium tracking-wide text-st-cream uppercase sm:text-2xl">{act.act}</p>
              <p className="mt-1 text-sm text-st-mute">{act.style} &middot; {act.room}</p>
            </div>
            <p className="col-start-2 text-sm tabular-nums text-st-cream/85 sm:col-start-3 sm:pr-4 sm:text-right">
              {formatTime(act.start)} to {formatTime(act.end)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
