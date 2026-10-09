/**
 * Front of House demo pill. Self-contained: markup, CSS, icons, awning mark and
 * the pre-paint state script all live in this file, so it can be copied into
 * another Next.js (React 19) demo as is. Usage: <DemoPill /> once per page,
 * optionally <DemoPill pitchHref="/pitch/" />.
 *
 * The pill cannot be removed, only minimized to a small tab in the same corner.
 * The state is kept in localStorage and applied to <html data-foh-pill="min">
 * before paint, so a minimized pill never flashes open on reload. It is a
 * server component: the toggle is a delegated click listener in the inline
 * script, so it works before (and without) hydration.
 */
import Link from "next/link";

export const PILL_STORAGE_KEY = "foh-demo-pill";
const LEGACY_DISMISS_KEY = "foh-demo-ribbon";

const initScript = `(function(){var d=document,h=d.documentElement,k="${PILL_STORAGE_KEY}";try{var s=localStorage.getItem(k);if(s==="min"||(s===null&&localStorage.getItem("${LEGACY_DISMISS_KEY}")==="off"))h.dataset.fohPill="min"}catch(e){}if(window.__fohPill)return;window.__fohPill=1;d.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-foh-pill-minimize],[data-foh-pill-expand]");if(!t)return;var min=t.hasAttribute("data-foh-pill-minimize");if(min)h.dataset.fohPill="min";else delete h.dataset.fohPill;try{localStorage.setItem(k,min?"min":"open")}catch(e){}var n=d.querySelector(min?"[data-foh-pill-expand]":"[data-foh-pill-minimize]");if(n)n.focus()})})()`;

const css = `
.foh-pill{position:fixed;bottom:calc(4.5rem + env(safe-area-inset-bottom));left:.75rem;z-index:50;display:flex;align-items:center;gap:.5rem;max-width:calc(100vw - 1.5rem);border:1px solid #3A322B;border-radius:9999px;background:#221C18;padding:.375rem .375rem .375rem .875rem;font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif);font-size:1rem;line-height:1.5;color:#FBF7F0;box-shadow:0 14px 40px rgb(0 0 0/.5)}
.foh-pill--tab{gap:.25rem;padding-left:.375rem}
.foh-pill__mark{height:1.4rem;width:auto;flex-shrink:0}
.foh-pill--full .foh-pill__mark{display:none}
.foh-pill__stack{display:flex;flex-direction:column;line-height:1.25}
.foh-pill__kicker{font-size:.68rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#C9BBA0}
.foh-pill__name{font-weight:600;white-space:nowrap}
.foh-pill__line{display:none;white-space:nowrap}
.foh-pill__line strong{font-weight:600}
.foh-pill__cta{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:3rem;min-width:3rem;flex-shrink:0;border-radius:9999px;background:#A8472B;padding:0 1.05rem;font-weight:600;white-space:nowrap;color:#fff;text-decoration:none;transition:background-color .15s}
.foh-pill__cta:hover{background:#C75B39}
.foh-pill--tab .foh-pill__cta{padding:0}
.foh-pill__cta-long{display:none}
.foh-pill__icon{display:grid;place-items:center;width:3rem;height:3rem;flex-shrink:0;border:0;border-radius:9999px;background:transparent;color:#C9BBA0;cursor:pointer;transition:background-color .15s,color .15s}
.foh-pill__icon:hover{background:rgb(255 255 255/.1);color:#FBF7F0}
.foh-pill__expand{display:inline-flex;align-items:center;gap:.5rem;min-height:3rem;flex-shrink:0;border:0;border-radius:9999px;background:transparent;padding:0 .75rem;font:inherit;font-weight:600;white-space:nowrap;color:inherit;cursor:pointer;transition:background-color .15s}
.foh-pill__expand:hover{background:rgb(255 255 255/.1)}
.foh-pill svg{flex-shrink:0}
html:not([data-foh-pill="min"]) .foh-pill--tab,html[data-foh-pill="min"] .foh-pill--full{display:none}
@media (min-width:360px){.foh-pill--full{gap:.875rem;padding-left:1.05rem;font-size:1.09rem}.foh-pill--tab{font-size:1.09rem}}
@media (min-width:400px){.foh-pill--full .foh-pill__mark{display:block}}
@media (min-width:640px){.foh-pill__stack{display:none}.foh-pill__line{display:inline}.foh-pill__cta-short{display:none}.foh-pill__cta-long{display:inline}}
@media (min-width:768px){.foh-pill{bottom:1.25rem;left:1.25rem}}
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

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function DemoPill({ pitchHref = "/pitch/" }: { pitchHref?: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initScript }} />
      <style href="foh-demo-pill" precedence="default">
        {css}
      </style>

      <aside data-demo-ribbon data-foh-pill-state="full" aria-label="Demo concept by Front of House" className="foh-pill foh-pill--full">
        <AwningMark className="foh-pill__mark" />
        <span className="foh-pill__stack">
          <span className="foh-pill__kicker">Demo concept</span>
          <strong className="foh-pill__name">Front of House</strong>
        </span>
        <span className="foh-pill__line">
          Demo concept by <strong>Front of House</strong>
        </span>
        <Link href={pitchHref} data-pitch-cta className="foh-pill__cta foh-nudge">
          <span className="foh-pill__cta-short">Pitch</span>
          <span className="foh-pill__cta-long">See the pitch</span>
        </Link>
        <button
          type="button"
          data-foh-pill-minimize
          aria-label="Minimize demo banner"
          aria-expanded="true"
          className="foh-pill__icon"
        >
          <Chevron />
        </button>
      </aside>

      <aside data-demo-ribbon data-foh-pill-state="tab" aria-label="Demo concept by Front of House, minimized" className="foh-pill foh-pill--tab">
        <button
          type="button"
          data-foh-pill-expand
          aria-label="Expand demo banner: Demo concept by Front of House"
          aria-expanded="false"
          className="foh-pill__expand"
        >
          <AwningMark className="foh-pill__mark" />
          <span>FOH Demo</span>
        </button>
        <Link href={pitchHref} data-pitch-cta aria-label="See the pitch" className="foh-pill__cta foh-nudge">
          <Arrow />
        </Link>
      </aside>
    </>
  );
}
