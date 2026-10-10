import { DAYS, formatDayRange, formatTime, site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Renders THE hours from src/data/site.ts. Used by every page that shows hours. */
export function HoursList({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { hours } = site;
  const brunchDay = DAYS.find((d) => d.code === hours.brunch.day)!.name;
  return (
    <div className={cn("text-sm", className)}>
      <dl className="space-y-2">
      {hours.regular.map((h) => (
        <div key={h.days.join()} className="flex items-baseline justify-between gap-4">
          <dt className="text-st-cream">
            {formatDayRange(h.days)}
          </dt>
          <dd className="tabular-nums text-st-cream/85">
            {formatTime(h.opens)} to {formatTime(h.closes)}
          </dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-st-cream">{brunchDay} brunch</dt>
        <dd className="text-st-cream/85">
          {hours.brunch.opens && hours.brunch.closes ? (
            `${formatTime(hours.brunch.opens)} to ${formatTime(hours.brunch.closes)}`
          ) : (
            "Hours vary"
          )}
        </dd>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-st-cream">{hours.happyHour.label}</dt>
        <dd className="tabular-nums text-st-cream/85">
          {formatDayRange(hours.happyHour.days)}, {formatTime(hours.happyHour.opens)} to {formatTime(hours.happyHour.closes)}
        </dd>
      </div>
      </dl>
      {!compact && !hours.confirmed && <p className="pt-4 text-xs leading-relaxed text-st-mute">{hours.note}</p>}
    </div>
  );
}
