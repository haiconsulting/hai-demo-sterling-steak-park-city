import { Oswald, Zilla_Slab } from "next/font/google";

/** Sterling's faces. Scoped to the restaurant pages so /pitch doesn't preload them. */
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-oswald", display: "swap" });
const zilla = Zilla_Slab({ subsets: ["latin"], weight: ["600"], variable: "--font-zilla", display: "swap" });

export const sterlingFonts = `${oswald.variable} ${zilla.variable}`;

