import { describe, expect, it } from "vitest";
import { siteGraph } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/paths";
import { site } from "@/data/site";
import { menu } from "@/data/menu";

type Node = Record<string, unknown> & { "@type": string | string[] };

const NOW = new Date("2026-10-09T21:00:00Z");
const graph = JSON.parse(JSON.stringify(siteGraph({ events: true, menu: true, faq: true, now: NOW }))) as {
  "@context": string;
  "@graph": Node[];
};
const byType = (t: string) => graph["@graph"].filter((n) => n["@type"] === t);

function walk(v: unknown, fn: (key: string, val: unknown) => void, key = "") {
  if (Array.isArray(v)) v.forEach((x) => walk(x, fn, key));
  else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, fn, k));
  else fn(key, v);
}

describe("JSON-LD graph", () => {
  it("round-trips as JSON with a schema.org context and no undefined/null values", () => {
    expect(graph["@context"]).toBe("https://schema.org");
    walk(graph, (k, v) => {
      expect(v, `value at ${k}`).not.toBeNull();
      expect(v, `value at ${k}`).not.toBeUndefined();
    });
  });

  it("describes the Restaurant with the fixed facts", () => {
    const [r] = byType("Restaurant");
    expect(r).toBeDefined();
    expect(r.name).toBe("Sterling Steak & Lounge");
    expect(r.telephone).toBe("+14358002884");
    expect(r.acceptsReservations).toBe(site.links.reserve);
    expect(r.address).toMatchObject({ "@type": "PostalAddress", postalCode: "84098", addressRegion: "UT" });
    expect(r.priceRange).toBeTruthy();
    const hours = r.openingHoursSpecification as { opens: string; closes: string; dayOfWeek: string[] }[];
    expect(hours.length).toBeGreaterThan(0);
    for (const h of hours) {
      expect(h.opens).toMatch(/^\d{2}:\d{2}$/);
      expect(h.closes).toMatch(/^\d{2}:\d{2}$/);
      h.dayOfWeek.forEach((d) => expect(d).toMatch(/^https:\/\/schema\.org\/\w+day$/));
    }
    const actions = (r.potentialAction as Node[]).map((a) => a["@type"]);
    expect(actions).toEqual(["ReserveAction", "OrderAction"]);
  });

  it("uses the one canonical name everywhere", () => {
    walk(graph, (_k, v) => {
      if (typeof v === "string") expect(v).not.toMatch(/Sterling Steaks/);
    });
  });

  it("publishes only real prices in the Menu", () => {
    const [m] = byType("Menu");
    const offers: { price: string; priceCurrency: string }[] = [];
    for (const s of m.hasMenuSection as Node[]) for (const i of s.hasMenuItem as Node[]) offers.push(...((i.offers as typeof offers) ?? []));
    const published = menu.flatMap((s) => s.items.flatMap((i) => i.options.filter((o) => o.price !== null)));
    expect(offers).toHaveLength(published.length);
    offers.forEach((o) => {
      expect(o.price).toMatch(/^\d+\.\d{2}$/);
      expect(o.priceCurrency).toBe("USD");
    });
  });

  it("emits 7 MusicEvents with ISO 8601 dates and a Park City offset", () => {
    const events = byType("MusicEvent");
    expect(events).toHaveLength(7);
    for (const e of events) {
      expect(e.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00-0[67]:00$/);
      expect(Date.parse(e.startDate as string)).toBeLessThan(Date.parse(e.endDate as string));
      expect(e.eventStatus).toBe("https://schema.org/EventScheduled");
      expect(e.location).toMatchObject({ "@type": "Restaurant" });
    }
    expect(events[0].startDate).toMatch(/^2026-10-09/);
  });

  it("builds every internal URL from SITE_URL so the base path is respected", () => {
    walk(graph, (k, v) => {
      if (typeof v !== "string" || !/^https?:\/\//.test(v)) return;
      if (/haiconsulting\.github\.io/.test(v) || k === "@id") expect(v.startsWith(SITE_URL), `${k}: ${v}`).toBe(true);
    });
  });

  it("includes an FAQPage with answered questions", () => {
    const [f] = byType("FAQPage");
    const qs = f.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(qs.length).toBeGreaterThan(3);
    qs.forEach((q) => expect(q.acceptedAnswer.text.length).toBeGreaterThan(10));
  });
});
