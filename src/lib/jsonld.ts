import type { FAQPage, Graph, Menu, MenuSection as SchemaMenuSection, MusicEvent, Restaurant, Thing, WebSite } from "schema-dts";
import { DAYS, fullAddress, site } from "@/data/site";
import { faq } from "@/data/faq";
import { menu, menuSource } from "@/data/menu";
import { LINEUP_IS_SAMPLE, denverOffset, upcoming } from "@/data/lineup";
import { absUrl } from "./paths";

const RESTAURANT_ID = absUrl("/#restaurant");
const MENU_ID = absUrl("/menu/#menu");
const WEBSITE_ID = absUrl("/#website");

function postalAddress() {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
}

export function restaurantNode(): Restaurant {
  return {
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: site.name,
    description: site.description,
    url: absUrl("/"),
    image: [absUrl("/img/og-sterling.jpg"), absUrl("/img/hero-1920.webp")],
    logo: absUrl("/img/logo-293.webp"),
    telephone: site.phone.e164,
    email: site.email,
    address: postalAddress(),
    hasMap: site.mapsUrl,
    servesCuisine: [...site.cuisine],
    priceRange: site.priceRange,
    foundingDate: site.opened,
    founder: site.owners.map((o) => ({ "@type": "Person" as const, name: o.name, jobTitle: o.role })),
    parentOrganization: { "@type": "Organization", name: site.parentCompany },
    acceptsReservations: site.links.reserve,
    hasMenu: { "@id": MENU_ID },
    menu: absUrl("/menu/"),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Live music 7 nights a week", value: true },
      { "@type": "LocationFeatureSpecification", name: site.patio, value: true },
      { "@type": "LocationFeatureSpecification", name: "Private events and buyouts", value: true },
    ],
    openingHoursSpecification: site.hours.regular.map((h) => ({
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: h.days.map((d) => DAYS.find((x) => x.code === d)!.schema) as never,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [site.links.instagram, site.links.facebook],
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: { "@type": "EntryPoint", urlTemplate: site.links.reserve, actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
        result: { "@type": "FoodEstablishmentReservation", name: `Table at ${site.name}` },
      },
      {
        "@type": "OrderAction",
        target: { "@type": "EntryPoint", urlTemplate: site.links.order, actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
        deliveryMethod: "https://schema.org/OnSitePickup",
      },
    ],
  };
}

export function menuNode(): Menu {
  const sections: SchemaMenuSection[] = menu
    .filter((s) => s.items.length > 0)
    .map((s) => ({
      "@type": "MenuSection",
      name: s.title,
      hasMenuItem: s.items.map((item) => {
        const priced = item.options.filter((o) => o.price !== null);
        return {
          "@type": "MenuItem" as const,
          name: item.name,
          ...(item.note ? { description: item.note } : {}),
          ...(priced.length
            ? {
                offers: priced.map((o) => ({
                  "@type": "Offer" as const,
                  ...(o.label ? { name: o.label } : {}),
                  price: o.price!.toFixed(2),
                  priceCurrency: "USD",
                })),
              }
            : {}),
        };
      }),
    }));
  return {
    "@type": "Menu",
    "@id": MENU_ID,
    name: `${site.name} food menu`,
    url: absUrl("/menu/"),
    inLanguage: "en-US",
    description: menuSource.label,
    hasMenuSection: sections,
  };
}

export function eventNodes(now = new Date()): MusicEvent[] {
  return upcoming(7, now).map((a) => {
    const off = denverOffset(a.date);
    return {
      "@type": "MusicEvent",
      "@id": absUrl(`/music/#${a.date}`),
      name: `${a.act} at ${site.name}`,
      description: `${a.style} on the ${a.room.toLowerCase()}.${LINEUP_IS_SAMPLE ? " Sample lineup for a demo; not a confirmed booking." : ""}`,
      startDate: `${a.date}T${a.start}:00${off}`,
      endDate: `${a.date}T${a.end}:00${off}`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Restaurant", "@id": RESTAURANT_ID, name: site.name, address: postalAddress() },
      performer: { "@type": "PerformingGroup", name: a.act },
      organizer: { "@type": "Organization", name: site.name, url: absUrl("/") },
      image: [absUrl("/img/lounge-800.webp")],
      url: absUrl("/music/"),
    };
  });
}

export function websiteNode(): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absUrl("/"),
    inLanguage: "en-US",
    publisher: { "@id": RESTAURANT_ID },
  };
}

export function faqNode(items: { q: string; a: string }[]): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": absUrl("/visit/#faq"),
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function siteGraph(opts: { events?: boolean; menu?: boolean; faq?: boolean; now?: Date } = {}): Graph {
  const nodes: Thing[] = [websiteNode(), restaurantNode()];
  if (opts.menu) nodes.push(menuNode());
  if (opts.events) nodes.push(...eventNodes(opts.now));
  if (opts.faq) nodes.push(faqNode(faq));
  return { "@context": "https://schema.org", "@graph": nodes };
}

export { fullAddress };
