/**
 * Menu items and prices as published on Sterling's current food menu
 * (captured Oct 9 2026). `price: null` means the current menu shows no price;
 * the page shows "Market price", as steakhouses do for cuts like these, and
 * the Menu schema leaves the price out. Never fill a price in without the
 * owners' confirmation.
 */

export type MenuOption = { label?: string; price: number | null };

export type MenuItem = {
  name: string;
  options: MenuOption[];
  note?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  blurb?: string;
  items: MenuItem[];
  placeholder?: string;
};

export const menuSource = {
  label: "Prices from the current Sterling food menu, Oct 9 2026",
  url: "https://sterlingsteakandlounge.com/park-city-kimball-junction-sterling-steaks-and-lounge-food-menu",
};

export const menu: MenuSection[] = [
  {
    id: "steaks",
    title: "Steaks",
    items: [
      { name: "Filet Mignon", options: [{ label: "6 oz", price: 62 }, { label: "10 oz", price: 78 }] },
      { name: "New York Strip", options: [{ label: "14 oz", price: 72 }] },
      { name: "Porterhouse", options: [{ label: "22 oz", price: 88 }, { label: "30 oz", price: 110 }] },
      { name: "Prime Rib", options: [{ label: "16 oz", price: 68 }], note: "Weekends" },
      { name: "Ribeye", options: [{ price: null }] },
      { name: "Tomahawk", options: [{ label: "45 oz", price: null }] },
      { name: "Surf & Turf", options: [{ price: null }] },
    ],
  },
  {
    id: "starters",
    title: "To start",
    items: [
      { name: "Roasted Bone Marrow", options: [{ price: 32 }] },
      { name: "Tuna Napoleon", options: [{ price: 28 }] },
      { name: "Crab Cakes", options: [{ price: 26 }] },
    ],
  },
  {
    id: "mains",
    title: "From the kitchen",
    items: [
      { name: "Tenderloin Lasagna", options: [{ price: 44 }] },
      { name: "Lobster Mac & Cheese", options: [{ price: 34 }] },
    ],
  },
  {
    id: "add-ons",
    title: "Add to any steak",
    items: [{ name: "Lobster Tail", options: [{ label: "add", price: 42 }] }],
  },
  {
    id: "lounge",
    title: "Lounge hour",
    blurb: "Half-price lounge bites, 4 to 6 pm, Sunday to Thursday.",
    items: [],
    placeholder: "The list of lounge bites included is to be confirmed with the kitchen.",
  },
  {
    id: "brunch",
    title: "Sunday brunch",
    blurb: "Sundays, 10 am to 2 pm. One guest review calls it \"the real best kept secret.\"",
    items: [],
  },
];

export function formatPrice(p: number | null): string {
  return p === null ? "Market price" : `$${p}`;
}
