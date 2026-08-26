const ITEMS = [
  "Simulated Trading",
  "Thailand Villa",
  "₹30 Lakh Prize Pool",
  "6 Days",
  "40 Khiladis",
  "4 Teams of 10",
];

export const EditorialMarquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="relative overflow-hidden border-y border-white/5 py-6 sm:py-8"
      aria-hidden="true"
      data-testid="editorial-marquee"
    >
      <div className="marquee-slow flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`font-display text-4xl uppercase leading-none tracking-wide sm:text-6xl ${
                i % 2 ? "text-outline" : "text-white/90"
              }`}
            >
              {t}
            </span>
            <span className="h-2 w-2 rotate-45 bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );
};
