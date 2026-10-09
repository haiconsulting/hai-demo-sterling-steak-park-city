/**
 * Front of House awning mark: 9 bays alternating Ember and Ink (Ember at both
 * ends) under an Ember rail. Never recolor outside Ink and Ember.
 */
export function FohMark({ className, title = "Front of House" }: { className?: string; title?: string }) {
  const bays = 9;
  const topL = 24, topR = 216, botL = 8, botR = 232, top = 18, bottom = 64;
  const polys = Array.from({ length: bays }, (_, i) => {
    const t0 = topL + ((topR - topL) * i) / bays;
    const t1 = topL + ((topR - topL) * (i + 1)) / bays;
    const b0 = botL + ((botR - botL) * i) / bays;
    const b1 = botL + ((botR - botL) * (i + 1)) / bays;
    const mid = (b0 + b1) / 2;
    const r = (b1 - b0) / 2;
    return {
      d: `M${t0} ${top} L${t1} ${top} L${b1} ${bottom} A${r} ${r * 0.55} 0 0 1 ${b0} ${bottom} Z`,
      fill: i % 2 === 0 ? "#C75B39" : "#221C18",
      key: mid,
    };
  });
  return (
    <svg viewBox="0 0 240 100" role="img" aria-label={title} className={className}>
      <rect x="24" y="7" width="192" height="11" rx="3" fill="#C75B39" />
      {polys.map((p) => (
        <path key={p.key} d={p.d} fill={p.fill} stroke="#FBF7F0" strokeWidth="1.6" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
