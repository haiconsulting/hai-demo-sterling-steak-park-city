import { DAYS, formatDayRange, formatTime, fullAddress, site } from "@/data/site";
import { formatPrice, menu } from "@/data/menu";
import { LINEUP_IS_SAMPLE, weeklyLineup } from "@/data/lineup";
import { absUrl } from "@/lib/paths";
import { IS_DEMO } from "@/lib/meta";


export function buildLlmsTxt(): string {
  const h = site.hours;
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
  ];
  if (IS_DEMO) {
    lines.push(
      "Note: this is a design demo by HAI Consulting (Front of House), not the official site. The official site is " +
        site.links.currentSite +
        ". Facts marked unconfirmed below are awaiting owner sign-off.",
      "",
    );
  }
  lines.push(
    "## Key facts",
    `- Name: ${site.name}`,
    `- Address: ${fullAddress} (${site.address.neighborhood})`,
    `- Phone: ${site.phone.display}`,
    `- Email: ${site.email}`,
    `- Cuisine: ${site.cuisine.join(", ")}`,
    `- Price range: ${site.priceRange}`,
    `- Opened: December 2021, by ${site.owners.map((o) => o.name).join(" and ")}`,
    `- Live music: ${site.story.music}`,
    `- Seating: ${site.seating.dining} in the dining room, ${site.seating.lounge} in the lounge`,
    `- ${site.patio}`,
    "",
    "## Hours",
    ...h.regular.map((r) => `- ${formatDayRange(r.days)}: ${formatTime(r.opens)} to ${formatTime(r.closes)}${h.confirmed ? "" : " (unconfirmed)"}`),
    `- ${DAYS.find((d) => d.code === h.brunch.day)!.name} brunch: ${h.brunch.opens && h.brunch.closes ? `${formatTime(h.brunch.opens)} to ${formatTime(h.brunch.closes)}` : "times to be confirmed"}`,
    `- ${h.happyHour.label}: ${formatDayRange(h.happyHour.days)}, ${formatTime(h.happyHour.opens)} to ${formatTime(h.happyHour.closes)}`,
    "",
    "## Book and order",
    `- Reservations (OpenTable): ${site.links.reserve}`,
    `- Pickup orders (SpotOn): ${site.links.order}`,
    `- Private events inquiry: ${absUrl("/private-events/")}`,
    "",
    "## Menu highlights",
    ...menu.flatMap((s) =>
      s.items.map((i) => `- ${i.name}: ${i.options.map((o) => `${o.label ? `${o.label} ` : ""}${formatPrice(o.price)}`).join(", ")}${i.note ? ` (${i.note})` : ""}`),
    ),
    "",
    `## Weekly music${LINEUP_IS_SAMPLE ? " (sample lineup, not confirmed bookings)" : ""}`,
    ...DAYS.map((d) => {
      const a = weeklyLineup[d.code];
      return `- ${d.name}: ${a.act}, ${a.style}, ${formatTime(a.start)} to ${formatTime(a.end)}`;
    }),
    "",
    "## Pages",
    `- [Home](${absUrl("/")})`,
    `- [On stage this week](${absUrl("/music/")})`,
    `- [Menu](${absUrl("/menu/")})`,
    `- [Private events and buyouts](${absUrl("/private-events/")})`,
    `- [Hours, location and FAQ](${absUrl("/visit/")})`,
    "",
    "## Elsewhere",
    `- Instagram: ${site.links.instagram}`,
    `- Facebook: ${site.links.facebook}`,
    "",
  );
  return lines.join("\n");
}

