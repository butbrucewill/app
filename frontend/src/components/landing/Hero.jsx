import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EVENT_DATE, IMAGES } from "@/constants";

function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

const FACTS = ["40 Participants", "4 Teams of 10", "6 Days", "Thailand Villa", "₹30L Prize Pool"];

export const Hero = () => {
  const t = useCountdown(EVENT_DATE);
  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Mins", value: t.minutes },
    { label: "Secs", value: t.seconds },
  ];

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-primary"
          data-testid="hero-eyebrow"
        >
          India's Simulated Trading Reality Show
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
          data-testid="hero-headline"
        >
          Trading
          <br />
          <span className="text-primary">Ke</span> Khiladi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          40 traders. 4 teams. 6 days inside a luxury Thailand villa. One simulated
          trading battlefield with a ₹30 lakh prize pool on the line.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="#apply"
            data-testid="hero-apply-btn"
            className="animate-pulse-red bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
          >
            Apply Now
          </a>
          <a
            href="#story"
            data-testid="hero-explore-btn"
            className="border border-white/25 px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-1 hover:border-white/60 hover:text-white"
          >
            Explore the Show
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12"
          data-testid="hero-countdown"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Applications close in
          </p>
          <div className="flex gap-3">
            {units.map((u) => (
              <div
                key={u.label}
                className="min-w-[72px] border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-md"
              >
                <div className="font-display text-3xl font-bold text-white">
                  {String(u.value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2"
        >
          {FACTS.map((f) => (
            <span key={f} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60">
              <span className="h-1.5 w-1.5 bg-primary" />
              {f}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
