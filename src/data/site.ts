/**
 * The one source of truth for Sterling's facts. Every page, the JSON-LD, the
 * footer and llms.txt read from here, so a fact is changed in one place.
 *
 * Facts come from the FOH prospect one-pager (public research, Oct 9 2026),
 * plus hours from the current site and OpenTable. Items the owners still need
 * to sign off on are listed on /pitch, not flagged on the restaurant pages.
 */

export type DayCode = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export const DAYS: { code: DayCode; name: string; schema: string }[] = [
  { code: "Mo", name: "Monday", schema: "https://schema.org/Monday" },
  { code: "Tu", name: "Tuesday", schema: "https://schema.org/Tuesday" },
  { code: "We", name: "Wednesday", schema: "https://schema.org/Wednesday" },
  { code: "Th", name: "Thursday", schema: "https://schema.org/Thursday" },
  { code: "Fr", name: "Friday", schema: "https://schema.org/Friday" },
  { code: "Sa", name: "Saturday", schema: "https://schema.org/Saturday" },
  { code: "Su", name: "Sunday", schema: "https://schema.org/Sunday" },
];

export const site = {
  name: "Sterling Steak & Lounge",
  shortName: "Sterling",
  tagline: "Steaks, a copper bar and live rock, seven nights a week.",
  description:
    "Rock-and-roll steakhouse and lounge at Kimball Junction, Park City. Steaks and seafood, a copper bar, collectible guitars and live music 7 nights a week.",
  cuisine: ["Steakhouse"],
  /** Derived from the published menu prices below ($26 to $110). */
  priceRange: "$26 to $110",
  opened: "2021-12",
  seating: { dining: "about 150", lounge: "80 to 100" },

  address: {
    street: "1242 Center Drive, Unit 1",
    city: "Park City",
    region: "UT",
    postalCode: "84098",
    country: "US",
    neighborhood: "Newpark, Kimball Junction",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sterling+Steak+%26+Lounge+1242+Center+Drive+Park+City+UT+84098",
  patio: "Patio facing the Swaner Preserve",

  phone: { display: "(435) 800-2884", e164: "+14358002884" },
  email: "jackson@sterlingsteakandlounge.com",

  links: {
    reserve: "https://www.opentable.com/r/sterling-steak-and-lounge-park-city",
    order: "https://order.spoton.com/614cf0679adef34932e1ca44",
    instagram: "https://www.instagram.com/sterlingsteakandlounge",
    facebook: "https://facebook.com/111664914620012",
    currentSite: "https://sterlingsteakandlounge.com/",
    /** SpotOn eGift cards, linked as "Purchase gift cards" from their SpotOn ordering page. */
    giftCards: "https://egiftcards.spoton.com/5847/614cf0679adef34932e1ca44",
  },

  owners: [
    { name: "Jackson Sterling", role: "Owner and operator, co-founder" },
    { name: "Lance Sterling", role: "Partner and co-founder" },
  ],
  parentCompany: "Sterling Venue Ventures Group",

  story: {
    lineage:
      "Lance Sterling ran the Atlanta House of Blues and more than 13 Southern California music venues before he and his son Jackson opened Sterling in December 2021.",
    room: [
      "Collectible guitars, including one from Sammy Hagar",
      "Musician portraits on the walls",
      "A copper bar and leather chairs",
      "Live-edge tables",
      "Classic rock videos on the screens",
    ],
    music: "Live music 7 nights a week, led by a house band playing mostly '70s and '80s rock.",
  },

  /**
   * THE hours. One record, used everywhere.
   * Daily 4 to 10 pm matches the current site's main hours and OpenTable;
   * Sunday brunch 10 am to 2 pm is from OpenTable. The current site's Events
   * page and 2021/22 press list other times, so /pitch asks the owners to
   * sign off before launch (no chip on the restaurant pages).
   */
  hours: {
    confirmed: true,
    source: "Current website and OpenTable, Oct 2026",
    note: "Daily 4 to 10 pm and Sunday brunch 10 am to 2 pm, from the current site and OpenTable. Their Events page and older press list other times.",
    regular: [{ days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as DayCode[], opens: "16:00", closes: "22:00" }],
    brunch: {
      day: "Su" as DayCode,
      opens: "10:00" as string | null,
      closes: "14:00" as string | null,
      confirmed: true,
      note: "Sunday brunch hours as listed on OpenTable. The current site does not list brunch.",
    },
    happyHour: {
      days: ["Su", "Mo", "Tu", "We", "Th"] as DayCode[],
      opens: "16:00",
      closes: "18:00",
      label: "Half-price lounge bites",
    },
  },

  reviews: [
    {
      quote: "The BEST Steak I've ever eaten",
      source: "Google review, as quoted on sterlingsteakandlounge.com",
    },
    {
      quote: "The real best kept secret is their Sunday brunch",
      source: "Google review, as quoted on sterlingsteakandlounge.com",
    },
  ],
} as const;

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDayRange(days: readonly DayCode[]): string {
  if (days.length === 7) return "Daily";
  const names = days.map((d) => DAYS.find((x) => x.code === d)!.name.slice(0, 3));
  return `${names[0]} to ${names[names.length - 1]}`;
}

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
