const TICKS = [
  { s: "NIFTY 50", v: "+1.42%", up: true },
  { s: "BANKNIFTY", v: "-0.68%", up: false },
  { s: "RELIANCE", v: "+2.10%", up: true },
  { s: "TCS", v: "+0.94%", up: true },
  { s: "HDFC BANK", v: "-1.12%", up: false },
  { s: "INFY", v: "+3.06%", up: true },
  { s: "ADANI ENT", v: "+4.51%", up: true },
  { s: "SBIN", v: "-0.34%", up: false },
  { s: "TATA MOTORS", v: "+1.88%", up: true },
];

export const Ticker = () => {
  const items = [...TICKS, ...TICKS, ...TICKS];
  return (
    <div
      data-testid="ticker-tape"
      className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-white/10 bg-[#070707]/90 backdrop-blur-xl"
    >
      <div className="marquee-track flex w-max gap-8 py-2 font-mono text-[11px] uppercase tracking-widest">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-white/50" data-testid={i < TICKS.length ? `ticker-${t.s.toLowerCase().replace(/\s+/g, "-")}` : undefined}>
            {t.s}
            <span className={t.up ? "text-bull" : "text-bear"}>{t.v}</span>
            <span className="text-white/15">/</span>
          </span>
        ))}
      </div>
    </div>
  );
};
