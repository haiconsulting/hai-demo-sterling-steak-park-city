/**
 * TONIGHT ON STAGE: weekly lineup.
 *
 * This is SAMPLE DATA for the demo. The acts and set times below are
 * placeholders, not real bookings. To update the lineup, edit the entries in
 * `weeklyLineup` (one per night) or add date-specific `specialDates`, which
 * win over the weekly entry for that date. On Care+, FOH does this weekly.
 *
 * Times are local to Park City (America/Denver), 24h "HH:MM".
 */
import type { DayCode } from "./site";

export const LINEUP_IS_SAMPLE = true;
export const TIMEZONE = "America/Denver";

export type Act = {
  act: string;
  style: string;
  start: string;
  end: string;
  room: "Lounge stage" | "Dining room" | "Patio";
  /** Short line for the card. Keep it factual once real acts are booked. */
  blurb?: string;
};

export const weeklyLineup: Record<DayCode, Act> = {
  Mo: { act: "Sample act: Acoustic Classics", style: "Unplugged rock", start: "19:00", end: "22:00", room: "Lounge stage" },
  Tu: { act: "Sample act: Blues Night", style: "Blues rock", start: "19:00", end: "22:00", room: "Lounge stage" },
  We: { act: "The House Band", style: "'70s and '80s rock", start: "19:00", end: "22:00", room: "Lounge stage", blurb: "Sterling's house band, playing mostly '70s and '80s rock." },
  Th: { act: "Sample act: Singer-Songwriter Set", style: "Classic rock covers", start: "19:00", end: "22:00", room: "Lounge stage" },
  Fr: { act: "The House Band", style: "'70s and '80s rock", start: "19:30", end: "22:00", room: "Lounge stage", blurb: "Sterling's house band, playing mostly '70s and '80s rock." },
  Sa: { act: "Sample act: Arena Rock Covers", style: "'80s arena rock", start: "19:30", end: "22:00", room: "Lounge stage" },
  Su: { act: "Sample act: Brunch Unplugged", style: "Acoustic", start: "18:00", end: "21:00", room: "Lounge stage" },
};

/** "YYYY-MM-DD" -> act. Example: { "2026-12-31": { act: "New Year's Eve", ... } } */
export const specialDates: Record<string, Act> = {};

const DAY_ORDER: DayCode[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Today's date parts in Park City, regardless of the visitor's timezone. */
export function parkCityToday(now = new Date()): { iso: string; day: DayCode } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const iso = `${get("year")}-${get("month")}-${get("day")}`;
  const wd = get("weekday").slice(0, 2) as DayCode;
  return { iso, day: wd };
}

export type DatedAct = Act & { date: string; day: DayCode };

/** The next `n` nights starting today (Park City time). */
export function upcoming(n = 7, now = new Date()): DatedAct[] {
  const { iso } = parkCityToday(now);
  const [y, m, d] = iso.split("-").map(Number);
  const out: DatedAct[] = [];
  for (let i = 0; i < n; i++) {
    const date = new Date(Date.UTC(y, m - 1, d + i, 12));
    const dIso = date.toISOString().slice(0, 10);
    const day = DAY_ORDER[date.getUTCDay()];
    out.push({ ...(specialDates[dIso] ?? weeklyLineup[day]), date: dIso, day });
  }
  return out;
}

/** UTC offset for a Park City local date, e.g. "-06:00" (MDT) or "-07:00" (MST). */
export function denverOffset(dateIso: string): string {
  const probe = new Date(`${dateIso}T12:00:00Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE, timeZoneName: "shortOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName")!.value; // "GMT-6"
  const hours = Number(name.replace("GMT", "") || 0);
  const sign = hours < 0 ? "-" : "+";
  return `${sign}${String(Math.abs(hours)).padStart(2, "0")}:00`;
}
