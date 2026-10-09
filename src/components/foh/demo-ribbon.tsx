"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { FohMark } from "./foh-mark";

export const RIBBON_KEY = "foh-demo-ribbon";

/** Runs in <head> before paint so a dismissed ribbon never flashes. */
export const ribbonInitScript = `try{if(localStorage.getItem("${RIBBON_KEY}")==="off")document.documentElement.dataset.fohRibbon="off"}catch(e){}`;

export function DemoRibbon() {
  const dismiss = () => {
    document.documentElement.dataset.fohRibbon = "off";
    try {
      localStorage.setItem(RIBBON_KEY, "off");
    } catch {}
  };

  return (
    <aside
      data-demo-ribbon
      aria-label="Demo notice"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 z-50 flex max-w-[calc(100vw-1.5rem)] items-center gap-2.5 rounded-full border border-[#3A322B] bg-foh-ink py-1.5 pr-1.5 pl-3 font-sans text-[0.78rem] text-foh-paper shadow-[0_10px_30px_rgb(0_0_0/0.45)] md:bottom-5 md:left-5"
    >
      <FohMark className="h-4 w-auto shrink-0 max-[359px]:hidden" />
      <span className="whitespace-nowrap">
        <span className="sm:hidden">Demo by </span>
        <span className="hidden sm:inline">Demo concept by </span>
        <strong className="font-semibold">HAI Consulting</strong>
        <span className="hidden text-foh-muted-on-ink sm:inline"> &middot; Front of House</span>
      </span>
      <Link
        href="/pitch/"
        className="rounded-full bg-foh-ember-deep px-3 py-1 font-semibold whitespace-nowrap text-white transition-colors hover:bg-foh-ember"
      >
        <span className="sm:hidden">Pitch</span>
        <span className="hidden sm:inline">See the pitch</span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss demo notice"
        className="grid size-7 shrink-0 place-items-center rounded-full text-foh-muted-on-ink transition-colors hover:bg-white/10 hover:text-foh-paper"
      >
        <X className="size-3.5" />
      </button>
    </aside>
  );
}
