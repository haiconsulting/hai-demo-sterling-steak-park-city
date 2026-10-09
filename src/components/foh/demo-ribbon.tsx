"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { FohMark } from "./foh-mark";

export const RIBBON_KEY = "foh-demo-ribbon";

/** Runs in <head> before paint so a dismissed ribbon never flashes. */
export const ribbonInitScript = `try{if(localStorage.getItem("${RIBBON_KEY}")==="off")document.documentElement.dataset.fohRibbon="off"}catch(e){}`;

/**
 * Sits 10px above the 62px mobile action bar (bottom-[4.5rem]) and bottom-left
 * on desktop. The footer's bottom padding reserves room for both, so the pill
 * never hides the last row of content.
 */
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
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 z-50 flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full border border-[#3A322B] bg-foh-ink py-1.5 pr-1.5 pl-3.5 font-sans text-base text-foh-paper shadow-[0_14px_40px_rgb(0_0_0/0.5)] min-[360px]:gap-3.5 min-[360px]:pl-[1.05rem] min-[360px]:text-[1.09rem] md:bottom-5 md:left-5"
    >
      <FohMark className="h-[1.4rem] w-auto shrink-0 max-[399px]:hidden" />
      <span className="flex flex-col leading-tight sm:hidden">
        <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-foh-muted-on-ink uppercase">Demo concept</span>
        <strong className="font-semibold whitespace-nowrap">HAI Consulting</strong>
      </span>
      <span className="hidden whitespace-nowrap sm:inline">
        Demo concept by <strong className="font-semibold">HAI Consulting</strong>
        <span className="text-foh-muted-on-ink"> &middot; Front of House</span>
      </span>
      <Link
        href="/pitch/"
        data-pitch-cta
        className="foh-nudge inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full bg-foh-ember-deep px-[1.05rem] font-semibold whitespace-nowrap text-white transition-colors hover:bg-foh-ember"
      >
        <span className="sm:hidden">Pitch</span>
        <span className="hidden sm:inline">See the pitch</span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss demo notice"
        className="grid size-12 shrink-0 place-items-center rounded-full text-foh-muted-on-ink transition-colors hover:bg-white/10 hover:text-foh-paper"
      >
        <X className="size-5" />
      </button>
    </aside>
  );
}
