const items = [
  "擬岩制作",
  "ARTIFICIAL ROCK",
  "店舗内装",
  "INTERIOR DESIGN",
  "エイジング塗装",
  "AGING PAINT",
  "FULL SCRATCH",
  "ARTISTIC",
  "TEAM OF COLORS",
  "職人の技術",
];

export default function Marquee() {
  const doubled = [
    ...items.map((t, i) => ({ t, key: `a-${i}` })),
    ...items.map((t, i) => ({ t, key: `b-${i}` })),
  ];

  return (
    <div className="py-5 bg-[#0d0d0d] border-y border-white/5 overflow-hidden select-none">
      <div className="marquee-track">
        {doubled.map(({ t: item, key }) => (
          <span key={key} className="flex items-center shrink-0">
            <span className="font-heading text-sm tracking-[0.3em] text-white/30 whitespace-nowrap px-6">
              {item}
            </span>

            <span className="text-gold text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
