import { formatTime, fullAddress, site } from "./site";

const hh = site.hours.happyHour;
const reg = site.hours.regular[0];

/** Answers use only facts from src/data/site.ts. Feeds /visit and FAQPage schema. */
export const faq: { q: string; a: string }[] = [
  {
    q: "Where is Sterling Steak & Lounge?",
    a: `${fullAddress}, in Newpark at Kimball Junction. The patio faces the Swaner Preserve.`,
  },
  {
    q: "What are the hours?",
    a: `Daily ${formatTime(reg.opens)} to ${formatTime(reg.closes)}. Sunday brunch ${formatTime(site.hours.brunch.opens!)} to ${formatTime(site.hours.brunch.closes!)}.`,
  },
  {
    q: "Is there live music?",
    a: "Yes, live music 7 nights a week. The house band plays mostly '70s and '80s rock. See the On stage page for this week's lineup.",
  },
  {
    q: "How do I make a reservation?",
    a: "Book on OpenTable using any Reserve button on this site, or call (435) 800-2884.",
  },
  {
    q: "Can I order takeout?",
    a: "Yes. Order pickup online through SpotOn using the Order button.",
  },
  {
    q: "Is there a happy hour?",
    a: `Half-price lounge bites from ${formatTime(hh.opens)} to ${formatTime(hh.closes)}, Sunday to Thursday.`,
  },
  {
    q: "Do you host private events?",
    a: "Yes: a private party room, rehearsal dinners, corporate events and full buyouts. Send an inquiry from the Private events page.",
  },
  {
    q: "Who owns Sterling?",
    a: `Father and son Lance and Jackson Sterling, who opened it in December 2021. Lance previously ran the Atlanta House of Blues.`,
  },
];
