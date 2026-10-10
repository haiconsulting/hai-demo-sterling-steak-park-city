"use client";

/**
 * Front of House demo pill. Self-contained: markup, CSS, icons, awning mark and
 * state handling all live in this file, so it can be copied into another
 * Next.js App Router (React 19) demo as is. Render it once per layout:
 *
 *   <DemoPill
 *     pitchHref="/pitch/"          // the pitch page; on it the CTA becomes "Back to demo"
 *     demoHref="/"                 // where "Back to demo" goes
 *     desktopPosition="right"      // "left" (default) or "right", 768px and up
 *     mobileBarHeight="62px"       // height of the host's fixed bottom bar on phones, if any
 *     spacerColor="#231F1C"        // background of the in-flow spacer (match the footer)
 *   />
 *
 * Phones (< 768px): a slim strip directly on top of the host's bottom bar (or
 * the viewport bottom), never a third floating layer. An in-flow spacer at the
 * end of the page reserves its height so it never hides the last content.
 * Desktop: a compact pill in the chosen bottom corner, with its own spacer.
 *
 * The pill cannot be removed, only minimized to a small tab in the same corner.
 * The state lives in localStorage and is mirrored to <html data-foh-pill="min">,
 * which the CSS below uses to show one state or the other.
 *
 * Why it is built this way:
 * - React never executes a <script> it renders on the client (client-side
 *   navigation, error recovery). So the toggle is a React onClick, not an
 *   inline script, and a layout effect applies the saved state before paint
 *   whenever the pill mounts on the client.
 * - On a full page load the saved state must be applied before first paint,
 *   so a tiny script is written into the server HTML only, via
 *   useServerInsertedHTML. It also catches taps that land before hydration.
 * - React state comes from useSyncExternalStore with a server snapshot of
 *   "expanded", so hydration never mismatches; it re-renders right after.
 */
import Link from "next/link";
import { usePathname, useRouter, useServerInsertedHTML } from "next/navigation";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";

export const PILL_STORAGE_KEY = "foh-demo-pill";
const LEGACY_DISMISS_KEY = "foh-demo-ribbon";
const ATTR = "data-foh-pill";

const initScript = `(function(){var d=document,h=d.documentElement,k="${PILL_STORAGE_KEY}";function set(m){if(m)h.setAttribute("${ATTR}","min");else h.removeAttribute("${ATTR}");try{localStorage.setItem(k,m?"min":"open")}catch(e){}}try{var s=localStorage.getItem(k);if(s==="min"||(s===null&&localStorage.getItem("${LEGACY_DISMISS_KEY}")==="off"))h.setAttribute("${ATTR}","min")}catch(e){}if(window.__fohPillEarly)return;window.__fohPillEarly=1;d.addEventListener("click",function(e){if(window.__fohPillHydrated)return;var t=e.target&&e.target.closest&&e.target.closest("[data-foh-pill-minimize],[data-foh-pill-expand]");if(t)set(t.hasAttribute("data-foh-pill-minimize"))})})()`;

function readStored(): boolean {
  try {
    const v = localStorage.getItem(PILL_STORAGE_KEY);
    if (v === "min") return true;
    if (v === "open") return false;
    return localStorage.getItem(LEGACY_DISMISS_KEY) === "off";
  } catch {
    return document.documentElement.getAttribute(ATTR) === "min";
  }
}

function apply(min: boolean) {
  const html = document.documentElement;
  if (min) html.setAttribute(ATTR, "min");
  else html.removeAttribute(ATTR);
}

function persist(min: boolean) {
  try {
    localStorage.setItem(PILL_STORAGE_KEY, min ? "min" : "open");
  } catch {}
}

/** External store: the <html> attribute, kept in sync with other tabs via the storage event. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [ATTR] });
  const onStorage = (e: StorageEvent) => {
    if (e.key === PILL_STORAGE_KEY) apply(readStored());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}
const getSnapshot = () => document.documentElement.getAttribute(ATTR) === "min";
const getServerSnapshot = () => false;

const css = `
.foh-pill{position:fixed;z-index:50;box-sizing:border-box;display:flex;align-items:center;border:1px solid #3A322B;background:#221C18;color:#FBF7F0;font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif);line-height:1.5}
.foh-pill--full{left:0;right:0;bottom:var(--foh-pill-bottom,0px);gap:.625rem;min-height:3.5rem;padding:.25rem .25rem calc(.25rem + var(--foh-pill-safe,0px)) .75rem;border-width:1px 0 0;border-radius:0;font-size:.9375rem;box-shadow:0 -10px 28px rgb(0 0 0/.35)}
.foh-pill--tab{left:.75rem;bottom:calc(var(--foh-pill-bottom,0px) + var(--foh-pill-safe,0px) + .5rem);gap:.25rem;padding:.25rem;border-radius:9999px;font-size:1rem;box-shadow:0 14px 40px rgb(0 0 0/.5)}
.foh-pill__mark{height:1.15rem;width:auto;flex-shrink:0}
.foh-pill--full .foh-pill__mark{display:none}
.foh-pill__stack{display:flex;flex-direction:column;min-width:0;line-height:1.2}
.foh-pill__kicker{font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#C9BBA0}
.foh-pill__name{font-weight:600;white-space:nowrap}
.foh-pill__line{display:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.foh-pill__line strong{font-weight:600}
.foh-pill__cta{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:3rem;min-width:3rem;flex-shrink:0;box-sizing:border-box;border-radius:9999px;background:#A8472B;padding:0 1rem;font-weight:600;white-space:nowrap;color:#fff;text-decoration:none;transition:background-color .15s}
.foh-pill__cta:hover{background:#C75B39}
.foh-pill--full .foh-pill__cta{margin-left:auto}
.foh-pill__cta--back{background:transparent;box-shadow:inset 0 0 0 1px #6B5C4E;color:#FBF7F0}
.foh-pill__cta--back:hover{background:rgb(255 255 255/.1)}
.foh-pill--tab .foh-pill__cta{padding:0}
.foh-pill__cta-long{display:none}
.foh-pill__icon{display:grid;place-items:center;width:3rem;height:3rem;flex-shrink:0;border:0;border-radius:9999px;background:transparent;color:#C9BBA0;cursor:pointer;transition:background-color .15s,color .15s}
.foh-pill__icon:hover{background:rgb(255 255 255/.1);color:#FBF7F0}
.foh-pill__expand{display:inline-flex;align-items:center;gap:.5rem;min-height:3rem;flex-shrink:0;border:0;border-radius:9999px;background:transparent;padding:0 .75rem;font:inherit;font-weight:600;white-space:nowrap;color:inherit;cursor:pointer;transition:background-color .15s}
.foh-pill__expand:hover{background:rgb(255 255 255/.1)}
.foh-pill svg{flex-shrink:0;pointer-events:none}
.foh-pill__cta,.foh-pill__icon,.foh-pill__expand{touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
.foh-pill-spacer{display:block;height:calc(3.5rem + var(--foh-pill-safe,0px));background:var(--foh-pill-spacer-bg,transparent)}
html:not([data-foh-pill="min"]) .foh-pill--tab,html[data-foh-pill="min"] .foh-pill--full{display:none}
@media (min-width:400px){.foh-pill--full .foh-pill__mark{display:block}}
@media (min-width:640px){.foh-pill__stack{display:none}.foh-pill__line{display:inline}.foh-pill__cta-short{display:none}.foh-pill__cta-long{display:inline}}
@media (min-width:768px){
.foh-pill--full{left:1.25rem;right:auto;bottom:1.25rem;gap:.625rem;min-height:0;padding:.25rem .25rem .25rem .875rem;border-width:1px;border-radius:9999px;box-shadow:0 14px 40px rgb(0 0 0/.5)}
.foh-pill--tab{left:1.25rem;bottom:1.25rem}
.foh-pill--right.foh-pill--full,.foh-pill--right.foh-pill--tab{left:auto;right:1.25rem}
.foh-pill--full .foh-pill__cta{margin-left:0;min-height:2.5rem;padding:0 .9rem}
.foh-pill--full .foh-pill__icon{width:2.5rem;height:2.5rem}
.foh-pill--tab .foh-pill__expand{min-height:2.5rem}
.foh-pill--tab .foh-pill__cta{min-height:2.5rem;min-width:2.5rem}
.foh-pill-spacer{height:4.75rem}
}
@keyframes foh-nudge{0%,85%,100%{transform:scale(1) rotate(0deg)}87.5%{transform:scale(1.12) rotate(-3.5deg)}90.5%{transform:scale(1.12) rotate(3.5deg)}93.5%{transform:scale(1.1) rotate(-2.5deg)}96.5%{transform:scale(1.05) rotate(1.5deg)}}
.foh-nudge{transform-origin:center;animation:foh-nudge 4s ease-in-out 2s infinite}
.foh-nudge:hover,.foh-nudge:focus,.foh-nudge:focus-visible,.foh-pill:hover .foh-nudge,.foh-pill:focus-within .foh-nudge{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.foh-nudge{animation:none}}
`;

function AwningMark({ className }: { className?: string }) {
  const bays = 9;
  const [topL, topR, botL, botR, top, bottom] = [24, 216, 8, 232, 18, 64];
  return (
    <svg viewBox="0 0 240 100" aria-hidden className={className}>
      <rect x="24" y="7" width="192" height="11" rx="3" fill="#C75B39" />
      {Array.from({ length: bays }, (_, i) => {
        const t0 = topL + ((topR - topL) * i) / bays;
        const t1 = topL + ((topR - topL) * (i + 1)) / bays;
        const b0 = botL + ((botR - botL) * i) / bays;
        const b1 = botL + ((botR - botL) * (i + 1)) / bays;
        const r = (b1 - b0) / 2;
        return (
          <path
            key={i}
            d={`M${t0} ${top} L${t1} ${top} L${b1} ${bottom} A${r} ${r * 0.55} 0 0 1 ${b0} ${bottom} Z`}
            fill={i % 2 === 0 ? "#C75B39" : "#221C18"}
            stroke="#FBF7F0"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Arrow = ({ back = false }: { back?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={back ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"} />
  </svg>
);

const trimSlash = (p: string) => p.replace(/\/+$/, "") || "/";

type DemoPillProps = {
  pitchHref?: string;
  demoHref?: string;
  desktopPosition?: "left" | "right";
  mobileBarHeight?: string;
  spacerColor?: string;
};

export function DemoPill({ pitchHref = "/pitch/", demoHref = "/", desktopPosition = "left", mobileBarHeight, spacerColor }: DemoPillProps) {
  const minimized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const minimizeRef = useRef<HTMLButtonElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const scriptSent = useRef(false);
  const router = useRouter();
  const onPitch = trimSlash(usePathname() ?? "") === trimSlash(pitchHref);

  useServerInsertedHTML(() => {
    if (scriptSent.current) return null;
    scriptSent.current = true;
    return <script id="foh-demo-pill-init" dangerouslySetInnerHTML={{ __html: initScript }} />;
  });

  useLayoutEffect(() => {
    apply(readStored());
    (window as Window & { __fohPillHydrated?: boolean }).__fohPillHydrated = true;
  }, []);

  const set = (min: boolean) => {
    persist(min);
    apply(min);
    (min ? expandRef : minimizeRef).current?.focus();
  };

  // The other route uses different fonts and CSS. Prefetching it on intent
  // (not on load) keeps navigation instant without "preloaded but not used" warnings.
  const target = onPitch ? demoHref : pitchHref;
  const prefetchOnIntent = { onPointerEnter: () => router.prefetch(target), onFocus: () => router.prefetch(target), onTouchStart: () => router.prefetch(target) };

  const vars = {
    "--foh-pill-bottom": mobileBarHeight ? `calc(${mobileBarHeight} + env(safe-area-inset-bottom))` : "0px",
    "--foh-pill-safe": mobileBarHeight ? "0px" : "env(safe-area-inset-bottom)",
    ...(spacerColor ? { "--foh-pill-spacer-bg": spacerColor } : {}),
  } as React.CSSProperties;
  const side = desktopPosition === "right" ? " foh-pill--right" : "";

  return (
    <>
      <style href="foh-demo-pill" precedence="default">
        {css}
      </style>

      <aside data-demo-ribbon data-foh-pill-state="full" aria-label="Demo concept by Front of House" className={`foh-pill foh-pill--full${side}`} style={vars}>
        <AwningMark className="foh-pill__mark" />
        <span className="foh-pill__stack">
          <span className="foh-pill__kicker">Demo concept</span>
          <strong className="foh-pill__name">Front of House</strong>
        </span>
        <span className="foh-pill__line">
          Demo concept by <strong>Front of House</strong>
        </span>
        {onPitch ? (
          <Link href={demoHref} prefetch={false} {...prefetchOnIntent} data-back-cta className="foh-pill__cta foh-pill__cta--back">
            <Arrow back />
            <span>Back to demo</span>
          </Link>
        ) : (
          <Link href={pitchHref} prefetch={false} {...prefetchOnIntent} data-pitch-cta className="foh-pill__cta foh-nudge">
            <span className="foh-pill__cta-short">Pitch</span>
            <span className="foh-pill__cta-long">See the pitch</span>
          </Link>
        )}
        <button
          ref={minimizeRef}
          type="button"
          data-foh-pill-minimize
          onClick={() => set(true)}
          aria-label="Minimize demo banner"
          aria-expanded={!minimized}
          className="foh-pill__icon"
        >
          <Chevron />
        </button>
      </aside>

      <aside
        data-demo-ribbon
        data-foh-pill-state="tab"
        aria-label="Demo concept by Front of House, minimized"
        className={`foh-pill foh-pill--tab${side}`}
        style={vars}
      >
        <button
          ref={expandRef}
          type="button"
          data-foh-pill-expand
          onClick={() => set(false)}
          aria-label="Expand demo banner: Demo concept by Front of House"
          aria-expanded={!minimized}
          className="foh-pill__expand"
        >
          <AwningMark className="foh-pill__mark" />
          <span>FOH Demo</span>
        </button>
        {onPitch ? (
          <Link href={demoHref} prefetch={false} {...prefetchOnIntent} data-back-cta aria-label="Back to demo" className="foh-pill__cta foh-pill__cta--back">
            <Arrow back />
          </Link>
        ) : (
          <Link href={pitchHref} prefetch={false} {...prefetchOnIntent} data-pitch-cta aria-label="See the pitch" className="foh-pill__cta foh-nudge">
            <Arrow />
          </Link>
        )}
      </aside>

      <div aria-hidden className="foh-pill-spacer" style={vars} />
    </>
  );
}
