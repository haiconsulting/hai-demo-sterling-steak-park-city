"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full border border-st-cream/20 text-st-cream"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-st-black/98 backdrop-blur md:top-20">
          <nav aria-label="Mobile" className="container-st flex flex-col gap-1 py-8">
            <Link href="/" onClick={() => setOpen(false)} className="h-display border-b border-st-cream/10 py-4 text-3xl text-st-cream">
              Home
            </Link>
            {items.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="h-display border-b border-st-cream/10 py-4 text-3xl text-st-cream">
                {n.label}
              </Link>
            ))}
            <a href={site.links.order} target="_blank" rel="noopener" className="h-display border-b border-st-cream/10 py-4 text-3xl text-st-gold-light">
              Order pickup
            </a>
            <p className="mt-6 text-sm text-st-mute">
              {site.address.street}, {site.address.city}
              <br />
              <a className="underline underline-offset-4" href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
            </p>
          </nav>
        </div>
      )}
    </div>
  );
}
